// These are within the summary sheets
PLANNED_INDEX = 5;
ACTUAL_INDEX = 6;
DIFFERENCE_INDEX = 7;
BUDGET_NAME_INDEX = 1;
TOTALS_TEXT = "Totals";

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

function showAllBudgets(toToast) {
  if (toToast === undefined) {
    toToast = true;
  };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(sheet.getName())) {
    toast(toToast, "This operation can only be performed on 'Summary' sheets.");
    return;
  };

  var columns = sheet.getRange("1:1"); // All columns
  sheet.unhideColumn(columns);

  var rows = sheet.getRange("A:A"); // All rows
  sheet.unhideRow(rows);

  toast(toToast, "Successfully opened all hidden budget(s).");
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
  return (row[PLANNED_INDEX] === 0) && (row[ACTUAL_INDEX] === 0) && (row[DIFFERENCE_INDEX] === 0) && (row[BUDGET_NAME_INDEX] != TOTALS_TEXT);
}
