function clearFutureMonthsTransactions(currentMonth) {
  var indexOfMonth = MONTHS.indexOf(currentMonth);
  var filteredMonths = MONTHS.splice(indexOfMonth + 1, 12 - indexOfMonth);

  for (var i = 0; i < filteredMonths.length; i++) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(filteredMonths[i]);
    var numColumns = sheet.getDataRange().getNumColumns();
    var numRows = sheet.getDataRange().getNumRows();
    sheet.getRange(TRANSACTION_START_ROW, 1, numRows, numColumns).setValue(null);

    var deleteCount = sheet.getMaxRows() - 50;
    if (deleteCount > 0) {
      shortenTransactionRows(sheet, deleteCount);
    };
  };
}

function clearFutureTransactions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on monthly transaction sheets.");
    return;
  };

  var currentMonth = sheet.getName();
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert(
    "Are you sure you wish to clear all transactions after " + currentMonth + "?",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    if (currentMonth === "December") {
      toast(true, "There are no months after December, so there are no transactions to clear.");
      return;
    }

    clearFutureMonthsTransactions(currentMonth);
    toast(true, "Successfully cleared all transactions after " + currentMonth + ".");
  };
}
