function addAccountToDataSheet(newAccountName) {
  var accountDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AccountData");
  var numRows = accountDataSheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed
  accountDataSheet.insertRowBefore(numRows);
  accountDataSheet.getRange(numRows, 1).setValue(newAccountName);
  sortAccounts();
}

function createAccount() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on monthly transaction sheets.");
    return;
  };

  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    "What is the name of your account?",
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() == ui.Button.OK) {
    var newAccountName = result.getResponseText();
    addAccountToDataSheet(newAccountName);
    toast(true, "Successfully created the new " + newAccountName + " account.");
  };
}

function sortAccounts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ACCOUNT_SHEET_NAME);
  sheet.sort(DATA_ACCOUNT_NAME_COLUMN_NUMBER, true);
}
