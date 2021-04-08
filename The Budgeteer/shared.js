function existingCategories() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_EXPENSE_SHEET_NAME);
  var expenses = sheet.getRange(
    CATEGORY_CATEGORY_NAME_COLUMN_LETTER + CATEGORY_CATEGORIES_START_ROW_NUMBER + ":" +
    CATEGORY_CATEGORY_NAME_COLUMN_LETTER
  ).getValues();
  var validExpenseCategories = [].concat.apply([], expenses);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_INCOME_SHEET_NAME);
  var income = sheet.getRange(
    CATEGORY_CATEGORY_NAME_COLUMN_LETTER + CATEGORY_CATEGORIES_START_ROW_NUMBER + ":" +
    CATEGORY_CATEGORY_NAME_COLUMN_LETTER
  ).getValues();
  validIncomeCategories = [].concat.apply([], income);

  validCategories = validExpenseCategories.concat(validIncomeCategories).filter(function (el) {
    return el != "";
  });

  return validCategories;
}

function findRowBasedOnCellContents(contents, sheetName, requiredColumn) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  for (var i = 0; i < values.length; i++) {
    if (requiredColumn) {
      if (values[i][requiredColumn] == contents) {
        return i;
      };
    } else {
      for (var j = 0; j < values[i].length; j++) {
        if (values[i][j] == contents) {
          return i;
        }
      }
    };
  };
}

function determineCategoryDataSheet(sheet) {
  var separatingRow = findRowBasedOnCellContents(
    SUMMARY_INCOME_EXPENSES_TEXT_SEPARATOR, SUMMARY_MONTHLY_SHEET_NAME, 1
  ) + 1;
  var activeRow = sheet.getActiveRange().getRow();

  if (separatingRow > activeRow) {
    return CATEGORY_INCOME_SHEET_NAME;
  } else if (separatingRow < activeRow) {
    return CATEGORY_EXPENSE_SHEET_NAME;
  } else {
    return null;
  };
}

function showAllCategories(toToast) {
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

  toast(toToast, "Successfully opened all hidden categories.");
}

function onTransactionsSheeet(sheetName) {
  return MONTHS.includes(sheetName);
}

function onSummarySheet(sheetName) {
  return sheetName.includes(SUMMARY_SHEET_SUB_NAME);
}

function onMonthlySummarySheet(sheetName) {
  return sheetName.includes(SUMMARY_MONTHLY_SHEET_NAME);
}

function toast(toToast, message) {
  if (toToast === true) {
    SpreadsheetApp.getActiveSpreadsheet().toast(message);
  };
}
