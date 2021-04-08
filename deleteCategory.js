function deleteCategory() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on 'Summary' sheets.");
    return;
  };

  var activeRow = sheet.getActiveRange().getRow();
  var categoryToDelete = sheet.getActiveCell().getValue();

  if (!existingCategories().includes(categoryToDelete)) {
    toast(true, "You must highlight the cell of the category name you wish to update.");
    return;
  };

  showAllCategories(false);
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert(
    "Are you sure you wish to delete the " + categoryToDelete +
    " category? Transactions already assigned to this category will not transfer to a new category.",
    ui.ButtonSet.YES_NO
  );

  if (result == ui.Button.YES) {
    var activeRow = sheet.getActiveRange().getRow();
    var categoryDataSheetName = determineCategoryDataSheet(sheet);

    deleteCategoryFromDataSheet(categoryToDelete, categoryDataSheetName);
    deleteCategoryFromMonthlySummary(activeRow);
    deleteCategoryFromYearlySummary(activeRow);

    toast(true, "Successfully deleted the " + categoryToDelete + " category.");
  };
}

function deleteCategoryFromDataSheet(categoryToDelete, categoryDataSheetName) {
  var categoryDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(categoryDataSheetName);
  // Because rows are 0-indexed
  var rowToDelete = findRowBasedOnCellContents(categoryToDelete, categoryDataSheetName, null) + 1;
  categoryDataSheet.deleteRow(rowToDelete);
}

function deleteCategoryFromMonthlySummary(activeRow) {
  var monthlySummarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUMMARY_MONTHLY_SHEET_NAME);
  monthlySummarySheet.deleteRow(activeRow);
}

function deleteCategoryFromYearlySummary(activeRow) {
  var monthlySummarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUMMARY_YEARLY_SHEET_NAME);
  monthlySummarySheet.deleteRow(activeRow);
}
