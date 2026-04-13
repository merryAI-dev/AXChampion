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
- 결과 화면에서 레벨/유형/총점 표시

---

## Features

- **Single-question flow**: 한 화면에 질문 1개씩 표시
- **Sticky mobile navigation**: 모바일에서 하단 고정형 버튼 UX
- **Google Sheets integration**: 응답을 시트에 자동 저장
- **Scoring system**: 객관식 기반 레벨 계산
- **Type classification**: 활용 업무 기준 유형 분류
- **Responsive UI**: 모바일/데스크톱 대응

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