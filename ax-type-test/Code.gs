const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = '기초설문';
const START_COL = 3;   // C열부터 응답 시작
const START_ROW = 3;   // 3행부터 저장

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('나의 AX 유형테스트')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitSurvey(formData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`시트 이름 "${SHEET_NAME}"을 찾을 수 없습니다.`);
    }

    const targetCol = getNextEmptyResponseColumn(sheet);

    const q1Score = scoreQ1(formData.q1);
    const q3Score = scoreQ3(formData.q3 || []);
    const q5Score = scoreQ5(formData.q5);
    const q7Score = scoreQ7(formData.q7);

    const totalScore = q1Score + q3Score + q5Score + q7Score;
    const level = getLevel(totalScore);
    const type = getType(formData.q3 || []);
    const submittedAt = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    const values = [
      [formData.nickname || ''],              // 3행
      [formData.q1 || ''],                    // 4행
      [(formData.q2 || []).join(', ')],       // 5행
      [(formData.q3 || []).join(', ')],       // 6행
      [formData.q4 || ''],                    // 7행
      [formData.q5 || ''],                    // 8행
      [formData.q6 || ''],                    // 9행
      [formData.q7 || ''],                    // 10행
      [formData.q8 || ''],                    // 11행
      [level],                                // 12행
      [type],                                 // 13행
      [submittedAt]                           // 14행
    ];

    sheet.getRange(START_ROW, targetCol, values.length, 1).setValues(values);

    return {
      success: true,
      message: `${columnToLetter(targetCol)}열에 응답이 저장되었습니다.`,
      level: level,
      type: type,
      totalScore: totalScore,
      submittedAt: submittedAt
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

function getNextEmptyResponseColumn(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), START_COL);
  const existingValues = sheet.getRange(START_ROW, START_COL, 1, lastCol - START_COL + 1).getValues()[0];

  for (let i = 0; i < existingValues.length; i++) {
    if (!existingValues[i]) {
      return START_COL + i;
    }
  }
  return lastCol + 1;
}

function scoreQ1(answer) {
  const map = {
    '거의 사용하지 않는다': 1,
    '가끔 생각날 때만 사용한다': 2,
    '일부 업무에서는 자주 사용한다': 3,
    '대부분의 업무에서 보조도구처럼 사용한다': 4,
    '업무 흐름에 거의 기본값처럼 포함되어 있다': 5
  };
  return map[answer] || 0;
}

function scoreQ3(selectedItems) {
  if (!selectedItems || selectedItems.length === 0) return 0;

  let maxScore = 0;

  selectedItems.forEach(item => {
    if (item === '아직 업무 활용 사례가 거의 없다') maxScore = Math.max(maxScore, 1);

    if (
      item === '문장 작성/교정' ||
      item === '요약/정리' ||
      item === '번역'
    ) maxScore = Math.max(maxScore, 2);

    if (
      item === '리서치' ||
      item === '기획안 초안 작성' ||
      item === '회의록 정리'
    ) maxScore = Math.max(maxScore, 3);

    if (
      item === '보고서/제안서 작성' ||
      item === '이미지 제작' ||
      item === '데이터/문서 분석'
    ) maxScore = Math.max(maxScore, 4);

    if (item === '반복업무 자동화 아이디어 구상') {
      maxScore = Math.max(maxScore, 5);
    }
  });

  return maxScore;
}

function scoreQ5(answer) {
  const map = {
    '어떻게 물어봐야 할지 잘 모르겠다': 1,
    '기본적인 요청만 가능하다': 2,
    '원하는 결과를 얻기 위해 질문을 조금씩 조정할 수 있다': 3,
    '업무 목적에 맞게 비교적 정교하게 요청할 수 있다': 4,
    '프롬프트를 설계하고 결과를 다듬어 실무에 안정적으로 적용할 수 있다': 5
  };
  return map[answer] || 0;
}

function scoreQ7(answer) {
  const map = {
    'AI를 왜 써야 하는지부터 감이 필요하다': 1,
    '내 업무에 어디에 붙일 수 있을지 사례가 필요하다': 2,
    '잘 쓰는 방법과 프롬프트 예시가 필요하다': 3,
    '반복업무를 줄이는 실질적 방법이 필요하다': 4,
    '팀 차원의 업무 프로세스 개선/자동화까지 함께 설계하고 싶다': 5
  };
  return map[answer] || 0;
}

function getLevel(totalScore) {
  if (totalScore >= 19) return 'AX챔피언';
  if (totalScore >= 16) return 'AX파일럿';
  if (totalScore >= 12) return 'AX실무러';
  if (totalScore >= 8) return 'AX새싹';
  return 'AX병아리';
}

function getType(selectedItems) {
  if (!selectedItems || selectedItems.length === 0) return '미분류';

  if (selectedItems.includes('반복업무 자동화 아이디어 구상')) return '자동화형';
  if (selectedItems.includes('데이터/문서 분석') || selectedItems.includes('리서치')) return '리서치형';
  if (selectedItems.includes('기획안 초안 작성')) return '기획형';
  if (
    selectedItems.includes('문장 작성/교정') ||
    selectedItems.includes('요약/정리') ||
    selectedItems.includes('보고서/제안서 작성') ||
    selectedItems.includes('회의록 정리')
  ) return '문서형';
  if (selectedItems.includes('이미지 제작')) return '크리에이티브형';

  return '일반형';
}

function columnToLetter(column) {
  let letter = '';
  while (column > 0) {
    let temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}
