MONTHS = [
  "January", "February", "March", "April", "May", "June","July",
  "August", "September", "October", "November", "December"
]

// These are for the summary sheets
SUMMARY_SHEET = "Summary";
MONTHLY_SUMMARY_SHEET = "Monthly " + SUMMARY_SHEET;
INCOME_EXPENSES_TEXT_SEPARATOR = "Expenses";

// These are the names of the category data sheets
CATEGORY_EXPENSE = "CategoryExpenseData";
CATEGORY_INCOME = "CategoryIncomeData";
CATEGORY_BEGINNING_ROW = 2;
CATEGORY_COLUMN = "A";

function existingCategories() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_EXPENSE);
  var expenses = sheet.getRange(CATEGORY_COLUMN + CATEGORY_BEGINNING_ROW + ":" + CATEGORY_COLUMN).getValues();
  var validExpenseCategories = [].concat.apply([], expenses);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATEGORY_INCOME);
  var income = sheet.getRange(CATEGORY_COLUMN + CATEGORY_BEGINNING_ROW + ":" + CATEGORY_COLUMN).getValues();
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
  var separatingRow = findRowBasedOnCellContents(INCOME_EXPENSES_TEXT_SEPARATOR, MONTHLY_SUMMARY_SHEET, 1) + 1;
  var activeRow = sheet.getActiveRange().getRow();

  if (separatingRow > activeRow) {
    return CATEGORY_INCOME;
  } else if (separatingRow < activeRow) {
    return CATEGORY_EXPENSE;
  } else {
    return null;
  };
}

function onTransactionsSheeet(sheetName) {
  return MONTHS.includes(sheetName);
}

function onSummarySheet(sheetName) {
  return sheetName.includes(SUMMARY_SHEET);
}

function onMonthlySummarySheet(sheetName) {
  return sheetName.includes(MONTHLY_SUMMARY_SHEET);
}

function toast(toToast, message) {
  if (toToast === true) {
    SpreadsheetApp.getActiveSpreadsheet().toast(message);
  };
}
