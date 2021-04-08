// These are within the summary sheets
MONTH_ROW_NUMBER = 3;
MONTH_COLUMN_NUMBER = 12;

// These are the names of the category data sheets
CATEGORY_EXPENSE = "CategoryExpenseData";
CATEGORY_INCOME = "CategoryIncomeData";
BUDGET_START_ROW_NUMBER = 2;
COLUMN_COUNT = 13;

function clearFutureBudgets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  showAllBudgets(false);
  var ui = SpreadsheetApp.getUi();
  var currentMonth = sheet.getRange(MONTH_ROW_NUMBER, MONTH_COLUMN_NUMBER).getValue();

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
    var column = lookUpMonthNumber(month);
    var numRows = sheet.getDataRange().getNumRows();
    var numColumns = COLUMN_COUNT - column - 1; // Total columns - current month's column - 1

    var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_INCOME);
    categoryData.getRange(BUDGET_START_ROW_NUMBER, column + 2, numRows, numColumns).setValue(null); // Add 2 for column because they are 0-indexed and we don't clear out current month

    var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_EXPENSE);
    categoryData.getRange(BUDGET_START_ROW_NUMBER, column + 2, numRows, numColumns).setValue(null); // Add 2 for column because they are 0-indexed and we don't clear out current month
}
