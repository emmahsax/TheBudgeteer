function sortTransactionsByDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on month transaction sheets.");
    return;
  };

  var numRows = sheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed

  getTransactionsRange(
    sheet,
    numRows,
    TRANSACTION_EXPENSES_START_COLUMN_LETTER,
    TRANSACTION_EXPENSES_END_COLUMN_LETTER,
    TRANSACTION_EXPENSES_DATE_COLUMN_NUMBER
  );

  getTransactionsRange(
    sheet,
    numRows,
    TRANSACTION_INCOME_START_COLUMN_LETTER,
    TRANSACTION_INCOME_END_COLUMN_LETTER,
    TRANSACTION_INCOME_DATE_COLUMN_NUMBER
  );

  toast(true, "Successfully sorted all transaction(s) by date.");
}

function sortTransactionsByCategory() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on month transaction sheets.");
    return;
  };

  var numRows = sheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed

  getTransactionsRange(
    sheet,
    numRows,
    TRANSACTION_EXPENSES_START_COLUMN_LETTER,
    TRANSACTION_EXPENSES_END_COLUMN_LETTER,
    TRANSACTION_EXPENSES_CATEGORY_COLUMN_NUMBER
  );

  getTransactionsRange(
    sheet,
    numRows,
    TRANSACTION_INCOME_START_COLUMN_LETTER,
    TRANSACTION_INCOME_END_COLUMN_LETTER,
    TRANSACTION_INCOME_CATEGORY_COLUMN_NUMBER
  );

  toast(true, "Successfully sorted all transaction(s) by category name.");
}

function sortTransactionsByAccount() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on month transaction sheets.");
    return;
  };

  var numRows = sheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed

  getTransactionsRange(
    sheet,
    numRows,
    TRANSACTION_EXPENSES_START_COLUMN_LETTER,
    TRANSACTION_EXPENSES_END_COLUMN_LETTER,
    TRANSACTION_EXPENSES_ACCOUNT_COLUMN_NUMBER
  );

  getTransactionsRange(
    sheet,
    numRows,
    TRANSACTION_INCOME_START_COLUMN_LETTER,
    TRANSACTION_INCOME_END_COLUMN_LETTER,
    TRANSACTION_INCOME_ACCOUNT_COLUMN_NUMBER
  );

  toast(true, "Successfully sorted all transaction(s) by account.");
}

function getTransactionsRange(sheet, numRows, startColumn, endColumn, sortColumn) {
  var range = sheet.getRange(startColumn + TRANSACTION_HEADER_ROW_COUNT + ":" + endColumn + numRows);
  range.sort({column: sortColumn, ascending: true})
}
