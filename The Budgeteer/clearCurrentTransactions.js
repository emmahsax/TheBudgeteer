function clearCurrentTransactions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on monthly transaction sheets.");
    return;
  };

  var ui = SpreadsheetApp.getUi();
  var month = sheet.getName();

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
  var numRows = sheet.getDataRange().getNumRows();
  var numColumns = sheet.getDataRange().getNumColumns();
  sheet.getRange(TRANSACTION_START_ROW, 1, numRows, numColumns).setValue(null);

  var deleteCount = sheet.getMaxRows() - 50;
  if (deleteCount > 0) {
    shortenTransactionRows(sheet, deleteCount);
  };
}
