function clearCurrentTransactions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on monthly transaction sheets.");
    return;
  };

  var month = sheet.getName();
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert(
    "Are you sure you wish to clear " + month + "'s transactions?",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    clearMonthTransactions(sheet);
    toast(true, "Successfully cleared " + month + "'s transactions.");
  };
}

function clearMonthTransactions(sheet) {
  var numColumns = sheet.getDataRange().getNumColumns();
  var numRows = sheet.getDataRange().getNumRows();
  sheet.getRange(TRANSACTION_START_ROW, 1, numRows, numColumns).setValue(null);

  var deleteCount = sheet.getMaxRows() - TRANSACTION_DEFAULT_ROW_COUNT;

  if (deleteCount > 0) {
    shortenTransactionRows(sheet, deleteCount);
  } else if (deleteCount < 0) {
    addTransactionRows(sheet, 6, (TRANSACTION_DEFAULT_ROW_COUNT - sheet.getMaxRows()));
  };
}
