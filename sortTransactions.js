// These are within the monthly transaction sheets
HEADER_ROW_COUNT = 5;
EXPENSES_START_COLUMN = "B";
EXPENSES_END_COLUMN = "E";
INCOME_START_COLUMN = "G";
INCOME_END_COLUMN = "J";
EXPENSES_SORT_DATE_COLUMN_NUMBER = 2;
INCOME_SORT_DATE_COLUMN_NUMBER = 7;
EXPENSES_SORT_CATEGORY_COLUMN_NUMBER = 5;
INCOME_SORT_CATEGORY_COLUMN_NUMBER = 10;

function sortTransactionsByDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on month transaction sheets.");
    return;
  };

  var numRows = sheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed

  getTransactionsRange(sheet, numRows, EXPENSES_START_COLUMN, EXPENSES_END_COLUMN, EXPENSES_SORT_DATE_COLUMN_NUMBER);
  getTransactionsRange(sheet, numRows, INCOME_START_COLUMN, INCOME_END_COLUMN, INCOME_SORT_DATE_COLUMN_NUMBER);

  toast(true, "Successfully sorted all transaction(s) by date.");
}

function sortTransactionsByCategory() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on month transaction sheets.");
    return;
  };

  var numRows = sheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed

  getTransactionsRange(sheet, numRows, EXPENSES_START_COLUMN, EXPENSES_END_COLUMN, EXPENSES_SORT_CATEGORY_COLUMN_NUMBER);
  getTransactionsRange(sheet, numRows, INCOME_START_COLUMN, INCOME_END_COLUMN, INCOME_SORT_CATEGORY_COLUMN_NUMBER);

  toast(true, "Successfully sorted all transaction(s) by category name.");
}

function getTransactionsRange(sheet, numRows, startColumn, endColumn, sortColumn) {
  var range = sheet.getRange(startColumn + HEADER_ROW_COUNT + ":" + endColumn + numRows);
  range.sort({column: sortColumn, ascending: true})
}
