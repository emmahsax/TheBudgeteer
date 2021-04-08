function sortCategories() {
  sortCategoryList(CATEGORY_EXPENSE_SHEET_NAME);
  sortCategoryList(CATEGORY_INCOME_SHEET_NAME);
}

function sortCategoryList(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var numRows = sheet.getDataRange().getNumRows();
  var range = sheet.getRange(CATEGORY_BUDGET_CATEGORY_NAME_COLUMN_LETTER + "2:" + CATEGORY_SHEET_COLUMN_LETTER + numRows);
  range.sort({column: CATEGORY_BUDGET_CATEGORY_NAME_COLUMN_NUMBER, ascending: true});
}
