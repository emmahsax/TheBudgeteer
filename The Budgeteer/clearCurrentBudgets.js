function clearCurrentBudgets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  showAllCategories(false);
  var ui = SpreadsheetApp.getUi();
  var month = sheet.getRange(SUMMARY_MONTH_ROW_NUMBER, SUMMARY_MONTH_COLUMN_NUMBER).getValue();

  var result = ui.alert(
    "Are you sure you wish to clear " + month + "'s budgets?",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    clearMonthBudgets(month, sheet);
    toast(true, "Successfully cleared " + month + "'s budgets.");
  };
}

function clearMonthBudgets(month, sheet) {
  var column = MONTHS.indexOf(month) + 1;
  var numRows = sheet.getDataRange().getNumRows();
  clearBudgetsForMonth(DATA_INCOME_SHEET_NAME, column, numRows);
  clearBudgetsForMonth(DATA_EXPENSE_SHEET_NAME, column, numRows);
}

function clearBudgetsForMonth(sheetName, column, numRows) {
  var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  // Add 1 for column because they are 0-indexed
  categoryData.getRange(DATA_CATEGORIES_START_ROW_NUMBER, column + 1, numRows).setValue(null);
}
