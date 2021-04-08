// These are within the summary sheets
MONTH_ROW_NUMBER = 3;
MONTH_COLUMN_NUMBER = 12;

// These are the names of the category data sheets
CATEGORY_EXPENSE = "CategoryExpenseData";
CATEGORY_INCOME = "CategoryIncomeData";
BUDGET_START_ROW_NUMBER = 2;

function copyLastMonthsBudgets() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  showAllBudgets(false);
  var ui = SpreadsheetApp.getUi();
  var currentMonth = sheet.getRange(MONTH_ROW_NUMBER, MONTH_COLUMN_NUMBER).getValue();
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
  var pastColumn = lookUpMonthNumber(pastMonth);
  var currentColumn = lookUpMonthNumber(currentMonth);
  var numRows = sheet.getDataRange().getNumRows();

  var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_INCOME);
  var pastData = categoryData.getRange(BUDGET_START_ROW_NUMBER, pastColumn + 1, numRows).getValues(); // Add 1 for column because they are 0-indexed
  categoryData.getRange(BUDGET_START_ROW_NUMBER, currentColumn + 1, numRows).setValues(pastData);

  categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_EXPENSE);
  pastData = categoryData.getRange(BUDGET_START_ROW_NUMBER, pastColumn + 1, numRows).getValues(); // Add 1 for column because they are 0-indexed
  categoryData.getRange(BUDGET_START_ROW_NUMBER, currentColumn + 1, numRows).setValues(pastData);
}
