EXPENSE_BUDGET_INDICATOR = "Expense"

// These are the names of the summary sheets
MONTHLY_SUMMARY = "Monthly Summary";
YEARLY_SUMMARY = "Yearly Summary";

// These are within the summary sheets
BUDGET_CATEGORY_NAME_COLUMN = "B";
BUDGET_CATEGORY_NAME_COLUMN_NUMBER = 2;
BUDGET_CATEGORY_NAME_COLUMN_HEIGHT = 1;
BUDGET_CATEGORY_NAME_COLUMN_WIDTH = 4;
BUDGET_PLANNED_COLUMN = "F";
BUDGET_PLANNED_COLUMN_NUMBER = 6;
BUDGET_ACTUAL_COLUMN = "G";
BUDGET_ACTUAL_COLUMN_NUMBER = 7;
BUDGET_DIFFERENCE_COLUMN_NUMBER = 8;
MONTH_CELL = "L3";

// These are within the category budget data sheets
CATEGORY_COLUMN_LETTER = "A";
CATEGORY_COLUMN_NUMBER = 1;
MONTH_COLUMNS_PLUS_ONE = "M";

// These are within the monthly transaction sheets
EXPENSE_TRANSACTIONS_CATEGORY = "E";
EXPENSE_TRANSACTIONS_AMOUNT = "D";
INCOME_TRANSACTIONS_CATEGORY = "J";
INCOME_TRANSACTIONS_AMOUNT = "I";

function createBudget() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on 'Summary' sheets.");
    return;
  };

  var activeRow = sheet.getActiveRange().getRow();
  showAllBudgets(false);
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    "What is the name of your new budget? Your new budget will be added directly above row " + activeRow + ".",
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() == ui.Button.OK) {
    var newCategoryName = result.getResponseText();
    var categoryDataSheetName = determineCategoryDataSheet(sheet);

    addCategoryToDataSheet(newCategoryName, categoryDataSheetName);
    addBudgetToMonthlySummary(activeRow, newCategoryName, categoryDataSheetName);
    addBudgetToYearlySummary(activeRow, newCategoryName, categoryDataSheetName);

    toast(true, "Successfully created the new " + newCategoryName + " budget.");
  };
}

function addCategoryToDataSheet(newCategoryName, categoryDataSheetName) {
  var categoryDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(categoryDataSheetName);
  var numRows = categoryDataSheet.getDataRange().getNumRows() + 1; // Because rows are 0-indexed
  categoryDataSheet.insertRowBefore(numRows);
  categoryDataSheet.getRange(numRows, 1).setValue(newCategoryName);
  sortCategories();
}

function differenceAmount(activeRow, categoryDataSheetName) {
  if (categoryDataSheetName.includes(EXPENSE_BUDGET_INDICATOR)) {
    return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + '), "", ' +
           BUDGET_PLANNED_COLUMN + activeRow + '-' + BUDGET_ACTUAL_COLUMN + activeRow + ')';
  } else {
    return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + '), "", ' +
           BUDGET_ACTUAL_COLUMN + activeRow + '-' + BUDGET_PLANNED_COLUMN + activeRow + ')';
  }
}

function addBudgetToMonthlySummary(activeRow, newCategoryName, categoryDataSheetName) {
  var monthlySummarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MONTHLY_SUMMARY);
  monthlySummarySheet.insertRowBefore(activeRow);
  monthlySummarySheet.getRange(
    activeRow,
    BUDGET_CATEGORY_NAME_COLUMN_NUMBER,
    BUDGET_CATEGORY_NAME_COLUMN_HEIGHT,
    BUDGET_CATEGORY_NAME_COLUMN_WIDTH
  ).mergeAcross();
  monthlySummarySheet.getRange(activeRow, BUDGET_CATEGORY_NAME_COLUMN_NUMBER).setValue(newCategoryName);
  monthlySummarySheet.getRange(activeRow, BUDGET_PLANNED_COLUMN_NUMBER).setFormula(monthlyBudgetAmount(activeRow, categoryDataSheetName));
  monthlySummarySheet.getRange(activeRow, BUDGET_ACTUAL_COLUMN_NUMBER).setFormula(monthlyActualAmount(activeRow, categoryDataSheetName));
  monthlySummarySheet.getRange(activeRow, BUDGET_DIFFERENCE_COLUMN_NUMBER).setFormula(differenceAmount(activeRow, categoryDataSheetName));
}

function monthlyBudgetAmount(activeRow, categoryDataSheetName) {
  activeRow = activeRow.toString();
  return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + '), "",' +
         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER +
         ':$' + CATEGORY_COLUMN_LETTER + ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
         ',indirect("' + categoryDataSheetName + '!$"&(substitute(address(1,MATCH($' +
         MONTH_CELL + ',' + categoryDataSheetName + '!' + CATEGORY_COLUMN_LETTER +
         CATEGORY_COLUMN_NUMBER + ':' + MONTH_COLUMNS_PLUS_ONE + '1,0),4),1,""))&":$"' +
         '&((substitute(address(1,MATCH($' + MONTH_CELL + ',' + categoryDataSheetName +
         '!' + CATEGORY_COLUMN_LETTER + CATEGORY_COLUMN_NUMBER + ':' + MONTH_COLUMNS_PLUS_ONE +
         '1,0),4),1,""))))))';
}

function monthlyActualAmount(activeRow, categoryDataSheetName) {
  if (categoryDataSheetName.includes(EXPENSE_BUDGET_INDICATOR)) {
    return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
           '), "", ' +
           'sumif(indirect(' + MONTH_CELL + '&"!$' + EXPENSE_TRANSACTIONS_CATEGORY +
           ':$' + EXPENSE_TRANSACTIONS_CATEGORY + '"),$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
           ',indirect(' + MONTH_CELL + '&"!$' + EXPENSE_TRANSACTIONS_AMOUNT +
           ':$' + EXPENSE_TRANSACTIONS_AMOUNT + '")))';
  } else {
    return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
           '), "", ' +
           'sumif(indirect(' + MONTH_CELL + '&"!$' + INCOME_TRANSACTIONS_CATEGORY +
           ':$' + INCOME_TRANSACTIONS_CATEGORY + '"),$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
           ',indirect(' + MONTH_CELL + '&"!$' + INCOME_TRANSACTIONS_AMOUNT +
           ':$' + INCOME_TRANSACTIONS_AMOUNT + '")))';
  };
}

function addBudgetToYearlySummary(activeRow, newCategoryName, categoryDataSheetName) {
  var yearlySummarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(YEARLY_SUMMARY);
  yearlySummarySheet.insertRowBefore(activeRow);
  yearlySummarySheet.getRange(
    activeRow,
    BUDGET_CATEGORY_NAME_COLUMN_NUMBER,
    BUDGET_CATEGORY_NAME_COLUMN_HEIGHT,
    BUDGET_CATEGORY_NAME_COLUMN_WIDTH
  ).mergeAcross();
  yearlySummarySheet.getRange(activeRow, BUDGET_CATEGORY_NAME_COLUMN_NUMBER).setValue(newCategoryName);
  yearlySummarySheet.getRange(activeRow, BUDGET_PLANNED_COLUMN_NUMBER).setFormula(yearlyBudgetAmount(activeRow, categoryDataSheetName));
  yearlySummarySheet.getRange(activeRow, BUDGET_ACTUAL_COLUMN_NUMBER).setFormula(yearlyActualAmount(activeRow, categoryDataSheetName));
  yearlySummarySheet.getRange(activeRow, BUDGET_DIFFERENCE_COLUMN_NUMBER).setFormula(differenceAmount(activeRow, categoryDataSheetName));
}

function yearlyBudgetAmount(activeRow, categoryDataSheetName) {
  activeRow = activeRow.toString();
  return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
         '), "", sum(' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$B:$B),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$C:$C),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$D:$D),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$E:$E),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$F:$F),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$G:$G),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$H:$H),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$I:$I),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$J:$J),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$K:$K),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$L:$L),' +

         'sumif(' + categoryDataSheetName + '!$' + CATEGORY_COLUMN_LETTER + ':$' + CATEGORY_COLUMN_LETTER +
         ',$' + BUDGET_CATEGORY_NAME_COLUMN + activeRow + ',' + categoryDataSheetName + '!$M:$M)))';
}

function yearlyActualAmount(activeRow, categoryDataSheetName) {
  if (categoryDataSheetName.includes(EXPENSE_BUDGET_INDICATOR)) {
    return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
           '), "", sum(' +

           'sumif(January!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', January!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + ')' +

           ',sumif(February!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', February!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(March!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', March!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(April!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', April!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(May!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', May!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(June!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', June!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(July!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', July!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(August!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', August!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(September!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', September!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(October!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', October!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(November!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', November!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + '),' +

           'sumif(December!$' + EXPENSE_TRANSACTIONS_CATEGORY + ':$' +
           EXPENSE_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', December!$' + EXPENSE_TRANSACTIONS_AMOUNT + ':$' +
           EXPENSE_TRANSACTIONS_AMOUNT + ')))';
  } else {
    return '=if(isblank($' + BUDGET_CATEGORY_NAME_COLUMN + activeRow +
           '), "",' +

           'sum(sumif(January!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', January!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(February!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', February!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(March!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', March!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(April!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', April!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(May!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', May!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(June!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', June!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(July!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', July!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(August!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', August!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(September!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', September!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(October!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', October!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(November!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', November!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + '),' +

           'sumif(December!$' + INCOME_TRANSACTIONS_CATEGORY + ':$' +
           INCOME_TRANSACTIONS_CATEGORY + ',$' + BUDGET_CATEGORY_NAME_COLUMN +
           activeRow + ', December!$' + INCOME_TRANSACTIONS_AMOUNT + ':$' +
           INCOME_TRANSACTIONS_AMOUNT + ')))';
  };
}
