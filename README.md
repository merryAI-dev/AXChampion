 # AX Type Test with Google Apps Script

 Google Apps Script 기반의 간단한 AX(업무 내 AI 활용) 유형 테스트 웹앱입니다.

 이 프로젝트는 다음을 지원합니다.

 - 질문 1개씩 순차 표시
 - 이전 / 다음 버튼
 - 모바일 친화형 UI
 - 복수선택 문항 최소 1개 선택 검증
 - 주관식 문항 선택 입력
 - 응답 결과를 Google Sheets에 열 단위로 저장
 - 점수 기반 AX 레벨 자동 산정
 - 활용 유형 자동 분류
 - 제출 시간 자동 기록
 - 결과 화면에서 레벨 / 유형 / 총점 표시

 ---

 ## Features

 - Single-question flow: 한 화면에 질문 1개씩 표시
 - Previous / Next navigation: 이전 / 다음 버튼 제공
 - Sticky mobile navigation: 모바일에서 하단 고정형 버튼 UX
 - Google Sheets integration: 응답을 시트에 자동 저장
 - Scoring system: 객관식 기반 레벨 계산
 - Type classification: 활용 업무 기준 유형 분류
 - Responsive UI: 모바일 / 데스크톱 대응

 ---

 ## Tech Stack

 - Google Apps Script
 - HTML / CSS / Vanilla JavaScript
 - Google Sheets

 ---

 ## File Structure

 ```bash
 .
 ├── Code.gs
 ├── Index.html
 └── README.md
 ```

 ---

 ## Google Sheet Structure

 이 프로젝트는 응답을 열 단위로 저장합니다.

 예시 시트 구조:

 - 응답 시작 열: C열
 - 응답 시작 행: 3행

 질문 라벨은 아래처럼 배치하는 것을 권장합니다.

 | 셀 | 내용 |
 |---|---|
 | B3 | 별명 |
 | B4 | 현재 업무에서 AI를 활용하는 빈도는 어느 정도인가요? |
 | B5 | 현재 가장 자주 사용하는 AI 도구는 무엇인가요? (복수선택 가능) |
 | B6 | AI를 주로 어떤 업무에 활용하고 있나요? (복수선택 가능) |
 | B7 | 가장 유용했던 활용 사례가 있으면 적어주세요. |
 | B8 | AI를 사용할 때 느끼는 익숙함 또는 자신감은 어느 정도인가요? |
 | B9 | AI를 쓸 때 가장 어려운 점을 적어주세요. |
 | B10 | 앞으로 AX 지원이 가장 필요한 수준은 어디에 가깝나요? |
 | B11 | AXC에게 가장 받고 싶은 지원을 자유롭게 적어주세요. |
 | B12 | 레벨 |
 | B13 | 유형 |
 | B14 | 제출시간 |

 응답은 다음처럼 저장됩니다.

 - 1번째 응답: C3:C14
 - 2번째 응답: D3:D14
 - 3번째 응답: E3:E14
 - ...

 중간에 빈 열이 있으면 해당 열을 우선 사용하고, 없으면 마지막 열 다음에 자동 확장됩니다.

 ---

 ## Setup

 ### 1. Google Sheet 준비

 응답을 저장할 Google Sheet를 생성합니다.

 ### 2. Apps Script 프로젝트 생성

 Google Sheet에서 아래 메뉴로 이동합니다.

 - 확장 프로그램 > Apps Script

 ### 3. Code.gs 붙여넣기

 기존 코드를 지우고 Code.gs 내용을 붙여넣습니다.

 ### 4. Index.html 추가

 Apps Script 편집기에서 새 HTML 파일을 만들고 Index.html 내용을 붙여넣습니다.

 ### 5. Spreadsheet ID 수정

 Code.gs에서 아래 값을 실제 시트 ID로 수정합니다.

 ```javascript
 const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
 ```

 Google Sheets URL 예시:

 ```text
 https://docs.google.com/spreadsheets/d/1abcDEFghIJKlmnoPQRstuVWxyz1234567890/edit
 ```

 위 URL에서 Spreadsheet ID는 다음 부분입니다.

 ```text
 1abcDEFghIJKlmnoPQRstuVWxyz1234567890
 ```

 ### 6. 시트 이름 확인

 아래 값도 실제 시트 탭 이름과 일치해야 합니다.

 ```javascript
 const SHEET_NAME = '기초설문';
 ```

 ### 7. 웹앱 배포

 Apps Script에서 아래 순서로 배포합니다.

 - 배포 > 새 배포
 - 유형: 웹 앱
 - 실행 사용자: 나
 - 액세스 권한: 조직 내 또는 링크 보유자

 설정 후 웹앱 URL을 공유합니다.

 ---

 ## Scoring Logic

 총점은 아래 4개 문항으로 계산됩니다.

 - Q1. AI 활용 빈도
 - Q3. AI 활용 업무 범위
 - Q5. AI 활용 익숙함 / 자신감
 - Q7. AX 지원 필요 수준

 ### Level Mapping

 | 총점 | 레벨 |
 |---:|---|
 | 19~20 | AX챔피언 |
 | 16~18 | AX파일럿 |
 | 12~15 | AX실무러 |
 | 8~11 | AX새싹 |
 | 4~7 | AX병아리 |

 ---

 ## Type Mapping

 Q3 응답 기준으로 아래 유형을 분류합니다.

 | 조건 | 유형 |
 |---|---|
 | 반복업무 자동화 아이디어 구상 포함 | 자동화형 |
 | 데이터/문서 분석 또는 리서치 포함 | 리서치형 |
 | 기획안 초안 작성 포함 | 기획형 |
 | 문장 작성/교정, 요약/정리, 보고서/제안서 작성, 회의록 정리 포함 | 문서형 |
 | 이미지 제작 포함 | 크리에이티브형 |
 | 해당 없음 | 일반형 |
 | 응답 없음 | 미분류 |

 ---

 ## Validation Rules

 - 별명: 필수
 - Q1: 필수
 - Q2: 복수선택, 최소 1개 선택 필수
 - Q3: 복수선택, 최소 1개 선택 필수
 - Q4: 선택
 - Q5: 필수
 - Q6: 선택
 - Q7: 필수
 - Q8: 선택

 ---

 ## Customization

 ### 제목 바꾸기

 Index.html에서 아래 부분을 수정하면 됩니다.

 ```html
 <title>나의 AX 유형테스트</title>
 <h1>🌼 나의 AX 유형테스트 🍋</h1>
 ```

 ### 문항 바꾸기

 Index.html의 questions 배열을 수정하면 됩니다.

 ### 레벨 기준 바꾸기

 Code.gs의 getLevel() 함수를 수정하면 됩니다.

 ```javascript
 function getLevel(totalScore) {
 ...
 }
 ```

 ### 유형 기준 바꾸기

 Code.gs의 getType() 함수를 수정하면 됩니다.

 ```javascript
 function getType(selectedItems) {
 ...
 }
 ```

 ### 결과 설명 문구 바꾸기

 Index.html의 getLevelDescription() 함수를 수정하면 됩니다.

 ```javascript
 function getLevelDescription(level) {
 ...
 }
 ```

 ---

 ## Notes

 - 같은 별명으로 여러 번 제출해도 새 열에 계속 누적됩니다.
 - 기존 응답을 덮어쓰지 않습니다.
 - 시트의 열 수는 자동으로 확장됩니다.
 - 모바일 UX를 위해 하단 버튼 영역을 스티키 방식으로 구성했습니다.
 - 결과 화면에서는 레벨, 유형, 총점, 제출시간을 함께 보여줍니다.

 ---

 ## License

 MIT