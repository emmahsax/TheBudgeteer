function clearFutureBudgets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  showAllCategories(false);
  var ui = SpreadsheetApp.getUi();
  var currentMonth = sheet.getRange(SUMMARY_MONTH_ROW_NUMBER, SUMMARY_MONTH_COLUMN_NUMBER).getValue();

  var result = ui.alert(
    "Are you sure you wish to clear all budgets after " + currentMonth + "?",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    if (currentMonth === "December") {
      toast(true, "There are no months after December, so there are no budgets to clear.");
      return;
    }

    clearFutureMonthsBudgets(currentMonth, sheet);
    toast(true, "Successfully cleared all budgets after " + currentMonth + ".");
  };
}

function clearFutureMonthsBudgets(month, sheet) {
    var column = MONTHS.indexOf(month) + 1;
    var numRows = sheet.getDataRange().getNumRows();
    var numColumns = DATA_CATEGORY_SHEET_COLUMN_COUNT - column - 1; // Total columns - current month's column - 1
    clearBudgetsForMonths(DATA_INCOME_SHEET_NAME, column, numRows, numColumns);
    clearBudgetsForMonths(DATA_EXPENSE_SHEET_NAME, column, numRows, numColumns);
}

function clearBudgetsForMonths(sheetName, column, numRows, numColumns) {
  var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  // Add 2 for column because they are 0-indexed and we don't clear out current month
  categoryData.getRange(DATA_CATEGORIES_START_ROW_NUMBER, column + 2, numRows, numColumns).setValue(null);
}
