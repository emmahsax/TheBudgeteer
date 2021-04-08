function copyLastMonthsBudgets() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  showAllCategories(false);
  var ui = SpreadsheetApp.getUi();
  var currentMonth = sheet.getRange(SUMMARY_MONTH_ROW_NUMBER, SUMMARY_MONTH_COLUMN_NUMBER).getValue();
  var monthIndex = MONTHS.indexOf(currentMonth);

  if (monthIndex === 0) {
    var pastMonth = "December";
  } else {
    var pastMonth = MONTHS[monthIndex - 1];
  }

  var result = ui.alert(
    "Are you sure you wish to copy all budgets from " + pastMonth + " to " + currentMonth + "?",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    copyBudgets(pastMonth, currentMonth, sheet);
    toast(true, "Successfully copied all budgets from " + pastMonth + " to " + currentMonth + ".");
  }
}

function copyBudgets(pastMonth, currentMonth, sheet) {
  var pastColumn = MONTHS.indexOf(pastMonth) + 1;
  var currentColumn = MONTHS.indexOf(currentMonth) + 1;
  var numRows = sheet.getDataRange().getNumRows();
  copyBudgetsForMonth(CATEGORY_INCOME_SHEET_NAME, pastColumn, currentColumn, numRows);
  copyBudgetsForMonth(CATEGORY_EXPENSE_SHEET_NAME, pastColumn, currentColumn, numRows);
}

function copyBudgetsForMonth(sheetName, pastColumn, currentColumn, numRows) {
  var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  // Add 1 for column because they are 0-indexed
  var pastData = categoryData.getRange(CATEGORY_CATEGORIES_START_ROW_NUMBER, pastColumn + 1, numRows).getValues();
  categoryData.getRange(CATEGORY_CATEGORIES_START_ROW_NUMBER, currentColumn + 1, numRows).setValues(pastData);
}
