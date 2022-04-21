function updateBudget() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  var currentCell = sheet.getActiveCell();

  if (currentCell.getColumn() != SUMMARY_CATEGORY_NAME_COLUMN_NUMBER) {
    var category = sheet.getRange(currentCell.getRow(), SUMMARY_CATEGORY_NAME_COLUMN_NUMBER).getValue();
  } else {
    var category = currentCell.getValue();
  };

  if (!existingCategories().includes(category)) {
    toast(true, "You must highlight any cell in the row of the category you wish to update.");
    return;
  };

  var month = sheet.getRange(SUMMARY_MONTH_ROW_NUMBER, SUMMARY_MONTH_COLUMN_NUMBER).getValue();
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    "What is the new budget amount for the " + category + " category?",
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() == ui.Button.OK) {
    var text = result.getResponseText();

    if (isNaN(text) || (text === "")) {
      toast(true, "I'm sorry, you must provide a numerical value to set the budget to.");
      return;
    };

    var listSheet = determineCategoryDataSheet(sheet);
    var row = findRowBasedOnCellContents(category, listSheet, null);
    var column = MONTHS.indexOf(month) + 1;
    var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listSheet);
    // Add 1 for each because they are 0-indexed
    categoryData.getRange(row + 1, column + 1).setValue(text);

    toast(true, "Successfully updated the budget for " + category + ".");
  };
}
