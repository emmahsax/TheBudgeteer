function refreshVisibleBudgets(toToast) {
  if (toToast === undefined) {
    toToast = true;
  };

  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(activeSheet.getName())) {
    toast(toToast, "This operation can only be performed on 'Summary' sheets.");
    return;
  };

  showAllBudgets(false);
  hideEmptyBudgets();
  toast(toToast, "Successfully refreshed which budget(s) are visible.");
}

function hideEmptyBudgets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(sheet.getName())) {
    return;
  };

  var rows = sheet.getDataRange();
  var values = rows.getValues();

  for (var i = 0; i < rows.getNumRows(); i++) {
    hideRowIfEmptyBudget(sheet, values, i);
  };
}

function hideRowIfEmptyBudget(sheet, values, index) {
  if (emptyBudget(values[index])) {
    var row = parseInt(index) + 1; // Because rows are 0-indexed
    sheet.hideRow(sheet.getRange(row, 1)); // This should stay at 1
  };
}

function emptyBudget(row) {
  return (
    (row[SUMMARY_BUDGET_PLANNED_COLUMN_INDEX] === 0) &&
    (row[SUMMARY_BUDGET_ACTUAL_COLUMN_INDEX] === 0) &&
    (row[SUMMARY_BUDGET_DIFFERENCE_COLUMN_INDEX] === 0) &&
    (row[SUMMARY_BUDGET_CATEGORY_NAME_COLUMN_INDEX] != SUMMARY_BUDGET_TOTALS_TEXT)
  );
}
