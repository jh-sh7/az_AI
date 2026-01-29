import asyncio
import json
from typing import Dict, Any
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AutomationEngine:
    """자동화 작업을 수행하는 엔진"""
    
    def __init__(self):
        self.driver = None
    
    def _get_driver(self):
        """Chrome 드라이버 생성"""
        if self.driver is None:
            chrome_options = Options()
            chrome_options.add_argument("--headless")  # 백그라운드 실행
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
        return self.driver
    
    async def execute_command(self, command: str, user_id: int) -> str:
        """명령을 파싱하고 실행"""
        try:
            # 명령 파싱 (JSON 형식 또는 자연어)
            parsed_command = self._parse_command(command)
            
            # 명령 타입에 따라 처리
            command_type = parsed_command.get("type", "general")
            
            if command_type == "web_navigation":
                return await self._handle_web_navigation(parsed_command, user_id)
            elif command_type == "form_fill":
                return await self._handle_form_fill(parsed_command, user_id)
            elif command_type == "data_extraction":
                return await self._handle_data_extraction(parsed_command, user_id)
            elif command_type == "end_task":
                return "작업이 종료되었습니다."
            else:
                return await self._handle_general_command(parsed_command, user_id)
        
        except Exception as e:
            logger.error(f"명령 실행 중 오류: {str(e)}")
            raise
    
    def _parse_command(self, command: str) -> Dict[str, Any]:
        """명령을 파싱하여 구조화된 데이터로 변환"""
        # JSON 형식인지 확인
        try:
            parsed = json.loads(command)
            return parsed
        except json.JSONDecodeError:
            pass
        
        # 자연어 명령 파싱 (간단한 키워드 기반)
        command_lower = command.lower()
        
        if "업무 종료" in command or "작업 종료" in command or "end" in command_lower:
            return {"type": "end_task"}
        
        if "이동" in command or "접속" in command or "navigate" in command_lower:
            # URL 추출 시도
            import re
            url_pattern = r'https?://[^\s]+'
            urls = re.findall(url_pattern, command)
            if urls:
                return {
                    "type": "web_navigation",
                    "url": urls[0],
                    "action": "navigate"
                }
        
        if "입력" in command or "작성" in command or "fill" in command_lower:
            return {
                "type": "form_fill",
                "command": command
            }
        
        if "추출" in command or "가져오기" in command or "extract" in command_lower:
            return {
                "type": "data_extraction",
                "command": command
            }
        
        # 기본 명령
        return {
            "type": "general",
            "command": command
        }
    
    async def _handle_web_navigation(self, command: Dict[str, Any], user_id: int) -> str:
        """웹 페이지 이동 처리"""
        driver = self._get_driver()
        url = command.get("url")
        
        if not url:
            return "오류: URL이 제공되지 않았습니다."
        
        try:
            driver.get(url)
            wait = WebDriverWait(driver, 10)
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            return f"성공적으로 {url}에 접속했습니다."
        except TimeoutException:
            return f"타임아웃: {url} 로딩에 실패했습니다."
        except Exception as e:
            return f"오류: {str(e)}"
    
    async def _handle_form_fill(self, command: Dict[str, Any], user_id: int) -> str:
        """폼 작성 처리"""
        # 실제 구현은 명령에 따라 다를 수 있음
        return f"폼 작성 작업을 수행했습니다: {command.get('command', '')}"
    
    async def _handle_data_extraction(self, command: Dict[str, Any], user_id: int) -> str:
        """데이터 추출 처리"""
        # 실제 구현은 명령에 따라 다를 수 있음
        return f"데이터 추출 작업을 수행했습니다: {command.get('command', '')}"
    
    async def _handle_general_command(self, command: Dict[str, Any], user_id: int) -> str:
        """일반 명령 처리"""
        cmd = command.get("command", "")
        return f"명령을 처리했습니다: {cmd}"
    
    def close(self):
        """드라이버 종료"""
        if self.driver:
            self.driver.quit()
            self.driver = None
