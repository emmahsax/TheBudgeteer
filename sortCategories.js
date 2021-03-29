// These are the names of the category data sheets
CATEGORY_EXPENSE = "CategoryExpenseData";
CATEGORY_INCOME = "CategoryIncomeData";

// These are within the category budget data sheets
CATEGORY_COLUMN_LETTER = "A";
CATEGORY_COLUMN_NUMBER = 1;
MONTH_COLUMNS_PLUS_ONE = "M";

function sortCategories() {
  sortCategoryList(CATEGORY_EXPENSE);
  sortCategoryList(CATEGORY_INCOME);
}

function sortCategoryList(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var numRows = sheet.getDataRange().getNumRows();
  var range = sheet.getRange(CATEGORY_COLUMN_LETTER + "2:" + MONTH_COLUMNS_PLUS_ONE + numRows);
  range.sort({column: CATEGORY_COLUMN_NUMBER, ascending: true});
}
