// These are within the summary sheets
MONTH_ROW_NUMBER = 3;
MONTH_COLUMN_NUMBER = 12;

// These are the names of the category data sheets
CATEGORY_EXPENSE = "CategoryExpenseData";
CATEGORY_INCOME = "CategoryIncomeData";
BUDGET_START_ROW_NUMBER = 2;

function clearCurrentBudgets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  showAllBudgets(false);
  var ui = SpreadsheetApp.getUi();
  var month = sheet.getRange(MONTH_ROW_NUMBER, MONTH_COLUMN_NUMBER).getValue();

  var result = ui.alert(
    "Are you sure you wish to clear " + month + "'s budgets?",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    clearMonthsBudgets(month, sheet);
    toast(true, "Successfully cleared " + month + "'s budgets.");
  };
}

function clearMonthsBudgets(month, sheet) {
    var column = lookUpMonthNumber(month);
    var numRows = sheet.getDataRange().getNumRows();

    var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_INCOME);
    categoryData.getRange(BUDGET_START_ROW_NUMBER, column + 1, numRows).setValue(null); // Add 1 for column because they are 0-indexed

    var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_EXPENSE);
    categoryData.getRange(BUDGET_START_ROW_NUMBER, column + 1, numRows).setValue(null); // Add 1 for column because they are 0-indexed
}
