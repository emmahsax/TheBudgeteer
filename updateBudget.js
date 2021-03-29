// These are within the summary sheets
MONTH_ROW_NUMBER = 3;
MONTH_COLUMN_NUMBER = 12;

function updateBudget() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onMonthlySummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on the 'Monthly Summary' sheet.");
    return;
  };

  var category = sheet.getActiveCell().getValue();

  if (!existingCategories().includes(category)) {
    toast(true, "You must highlight the cell of the category name you wish to update.");
    return;
  };

  var month = sheet.getRange(MONTH_ROW_NUMBER, MONTH_COLUMN_NUMBER).getValue();
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
    var column = lookUpMonthNumber(month);
    var categoryData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listSheet);
    categoryData.getRange(row + 1, column + 1).setValue(text); // Add 1 for each because they are 0-indexed

    toast(true, "Successfully updated the budget for " + category + ".");
  };
}

function lookUpMonthNumber(monthName) {
  var months = new Object();
  months["January"] = 1;
  months["February"] = 2;
  months["March"] = 3;
  months["April"] = 4;
  months["May"] = 5;
  months["June"] = 6;
  months["July"] = 7;
  months["August"] = 8;
  months["September"] = 9;
  months["October"] = 10;
  months["November"] = 11;
  months["December"] = 12;

  return months[monthName];
}
