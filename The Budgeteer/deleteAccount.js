function deleteAccount() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onTransactionsSheeet(sheet.getName())) {
    toast(true, "This operation can only be performed on month transaction sheets.");
    return;
  };

  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    "What is the name of the account you wish to delete?",
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() == ui.Button.OK) {
    var accountToDelete = result.getResponseText();

    if (!existingAccounts().includes(accountToDelete)) {
      toast(true, "Invalid account name to delete.");
      return;
    };

    deleteAccountFromDataSheet(accountToDelete);
    toast(true, "Successfully deleted the " + accountToDelete + " account.");
  };
}

function deleteAccountFromDataSheet(accountToDelete) {
  var accountDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_ACCOUNT_SHEET_NAME);
  // Because rows are 0-indexed
  var rowToDelete = findRowBasedOnCellContents(accountToDelete, CATEGORY_ACCOUNT_SHEET_NAME, null) + 1;
  accountDataSheet.deleteRow(rowToDelete);
}
