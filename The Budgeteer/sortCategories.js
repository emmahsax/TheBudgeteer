function sortCategories() {
  sortCategoryList(DATA_EXPENSE_SHEET_NAME);
  sortCategoryList(DATA_INCOME_SHEET_NAME);
}

function sortCategoryList(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var numRows = sheet.getDataRange().getNumRows();
  var range = sheet.getRange(DATA_CATEGORY_NAME_COLUMN_LETTER + "2:" + DATA_CATEGORY_SHEET_COLUMN_LETTER + numRows);
  range.sort({column: DATA_CATEGORY_NAME_COLUMN_NUMBER, ascending: true});
}
