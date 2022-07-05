function hideEmptyCategories() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(sheet.getName())) {
    return;
  };

  var rows = sheet.getDataRange();
  var values = rows.getValues();

  for (var i = 0; i < rows.getNumRows(); i++) {
    hideRowIfEmptyCategory(sheet, values, i);
  };
}

function hideRowIfEmptyCategory(sheet, values, index) {
  if (emptyCategory(values[index])) {
    var row = parseInt(index) + 1; // Because rows are 0-indexed
    sheet.hideRow(sheet.getRange(row, 1)); // This should stay at 1
  };
}

function emptyCategory(row) {
  return (
    (row[SUMMARY_CATEGORY_PLANNED_COLUMN_INDEX] === 0) &&
    (row[SUMMARY_CATEGORY_ACTUAL_COLUMN_INDEX] === 0) &&
    (row[SUMMARY_CATEGORY_DIFFERENCE_COLUMN_INDEX] === 0) &&
    (row[SUMMARY_CATEGORY_NAME_COLUMN_INDEX] != SUMMARY_TOTALS_TEXT)
  );
}

function refreshVisibleCategories(toToast) {
  if (toToast === undefined) {
    toToast = true;
  };

  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(activeSheet.getName())) {
    toast(toToast, "This operation can only be performed on 'Summary' sheets.");
    return;
  };

  hideEmptyCategories();
  showAllCategories(false);
  toast(toToast, "Successfully refreshed which categories are visible.");
}
