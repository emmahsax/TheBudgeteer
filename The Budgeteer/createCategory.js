function createCategory() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!onSummarySheet(sheet.getName())) {
    toast(true, "This operation can only be performed on 'Summary' sheets.");
    return;
  };

  var activeRow = sheet.getActiveRange().getRow();
  showAllCategories(false);
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    "What is the name of your new category? The new category will be added directly above row " + activeRow + ".",
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() == ui.Button.OK) {
    var newCategoryName = result.getResponseText();
    var categoryDataSheetName = determineCategoryDataSheet(sheet);

    addCategoryToDataSheet(newCategoryName, categoryDataSheetName);
    addCategoryToMonthlySummary(activeRow, newCategoryName, categoryDataSheetName);
    addCategoryToYearlySummary(activeRow, newCategoryName, categoryDataSheetName);

    toast(true, "Successfully created the new " + newCategoryName + " category.");
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
  if (categoryDataSheetName.includes(EXPENSE_CATEGORY_INDICATOR)) {
    return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow + '), "", ' +
           SUMMARY_CATEGORY_PLANNED_COLUMN_LETTER + activeRow + '-' +
           SUMMARY_CATEGORY_ACTUAL_COLUMN_LETTER + activeRow + ')';
  } else {
    return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow + '), "", ' +
           SUMMARY_CATEGORY_ACTUAL_COLUMN_LETTER + activeRow + '-' +
           SUMMARY_CATEGORY_PLANNED_COLUMN_LETTER + activeRow + ')';
  }
}

function addCategoryToMonthlySummary(activeRow, newCategoryName, categoryDataSheetName) {
  var monthlySummarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUMMARY_MONTHLY_SHEET_NAME);

  monthlySummarySheet.insertRowBefore(activeRow);

  monthlySummarySheet.getRange(
    activeRow,
    SUMMARY_CATEGORY_NAME_COLUMN_NUMBER,
    SUMMARY_CATEGORY_NAME_COLUMN_HEIGHT,
    SUMMARY_CATEGORY_NAME_COLUMN_WIDTH
  ).mergeAcross();

  monthlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_NAME_COLUMN_NUMBER).setValue(newCategoryName);

  monthlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_PLANNED_COLUMN_NUMBER).setFormula(
    monthlyPlannedAmount(activeRow, categoryDataSheetName)
  );

  monthlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_ACTUAL_COLUMN_NUMBER).setFormula(
    monthlyActualAmount(activeRow, categoryDataSheetName)
  );

  monthlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_DIFFERENCE_COLUMN_NUMBER).setFormula(
    differenceAmount(activeRow, categoryDataSheetName)
  );
}

function monthlyPlannedAmount(activeRow, categoryDataSheetName) {
  activeRow = activeRow.toString();
  return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow + '), "",' +
         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER +
         ':$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',indirect("' + categoryDataSheetName + '!$"&(substitute(address(1,MATCH($' +
         SUMMARY_MONTH_COLUMN + '$' + SUMMARY_MONTH_ROW + ',' + categoryDataSheetName + '!' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + '$' + DATA_CATEGORY_NAME_COLUMN_NUMBER + ':' + DATA_CATEGORY_SHEET_COLUMN_LETTER +
         '$1,0),4),1,""))&":$"' + '&((substitute(address(1,MATCH($' + SUMMARY_MONTH_COLUMN + '$' + SUMMARY_MONTH_ROW +
         ',' + categoryDataSheetName + '!' + DATA_CATEGORY_NAME_COLUMN_LETTER + '$' + DATA_CATEGORY_NAME_COLUMN_NUMBER +
         ':' + DATA_CATEGORY_SHEET_COLUMN_LETTER + '$1,0),4),1,""))))))';
}

function monthlyActualAmount(activeRow, categoryDataSheetName) {
  if (categoryDataSheetName.includes(EXPENSE_CATEGORY_INDICATOR)) {
    return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow +
           '), "", ' +
           'sumif(indirect(' + SUMMARY_MONTH_COLUMN + '$' + SUMMARY_MONTH_ROW + '&"!$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER +
           '"),$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow + ',indirect(' + SUMMARY_MONTH_COLUMN +
           '$' + SUMMARY_MONTH_ROW + '&"!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER +
           ':$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '")))';
  } else {
    return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow +
           '), "", ' +
           'sumif(indirect(' + SUMMARY_MONTH_COLUMN + '$' + SUMMARY_MONTH_ROW + '&"!$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER +
           '"),$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow + ',indirect(' + SUMMARY_MONTH_COLUMN +
           '$' + SUMMARY_MONTH_ROW + '&"!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER +
           ':$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '")))';
  };
}

function addCategoryToYearlySummary(activeRow, newCategoryName, categoryDataSheetName) {
  var yearlySummarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUMMARY_YEARLY_SHEET_NAME);

  yearlySummarySheet.insertRowBefore(activeRow);

  yearlySummarySheet.getRange(
    activeRow,
    SUMMARY_CATEGORY_NAME_COLUMN_NUMBER,
    SUMMARY_CATEGORY_NAME_COLUMN_HEIGHT,
    SUMMARY_CATEGORY_NAME_COLUMN_WIDTH
  ).mergeAcross();

  yearlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_NAME_COLUMN_NUMBER).setValue(newCategoryName);

  yearlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_PLANNED_COLUMN_NUMBER).setFormula(
    yearlyPlannedAmount(activeRow, categoryDataSheetName)
  );

  yearlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_ACTUAL_COLUMN_NUMBER).setFormula(
    yearlyActualAmount(activeRow, categoryDataSheetName)
  );

  yearlySummarySheet.getRange(activeRow, SUMMARY_CATEGORY_DIFFERENCE_COLUMN_NUMBER).setFormula(
    differenceAmount(activeRow, categoryDataSheetName)
  );
}

function yearlyPlannedAmount(activeRow, categoryDataSheetName) {
  activeRow = activeRow.toString();
  return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow +
         '), "", sum(' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$B:$B),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$C:$C),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$D:$D),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$E:$E),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$F:$F),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$G:$G),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$H:$H),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$I:$I),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$J:$J),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$K:$K),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$L:$L),' +

         'sumif(' + categoryDataSheetName + '!$' + DATA_CATEGORY_NAME_COLUMN_LETTER + ':$' +
         DATA_CATEGORY_NAME_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
         activeRow + ',' + categoryDataSheetName + '!$M:$M)))';
}

function yearlyActualAmount(activeRow, categoryDataSheetName) {
  if (categoryDataSheetName.includes(EXPENSE_CATEGORY_INDICATOR)) {
    return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow +
           '), "", sum(' +

           'sumif(January!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', January!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ')' +

           ',sumif(February!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', February!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(March!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', March!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(April!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', April!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(May!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', May!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(June!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', June!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(July!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', July!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(August!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', August!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(September!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', September!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(October!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', October!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(November!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', November!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(December!$' + TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', December!$' + TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_EXPENSES_AMOUNT_COLUMN_LETTER + ')))';
  } else {
    return '=if(isblank($' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER + activeRow +
           '), "",' +

           'sum(sumif(January!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', January!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(February!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', February!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(March!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', March!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(April!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', April!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(May!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', May!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(June!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', June!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(July!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', July!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(August!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', August!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(September!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', September!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(October!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', October!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(November!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', November!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + '),' +

           'sumif(December!$' + TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_CATEGORY_COLUMN_LETTER + ',$' + SUMMARY_CATEGORY_NAME_COLUMN_LETTER +
           activeRow + ', December!$' + TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ':$' +
           TRANSACTION_INCOME_AMOUNT_COLUMN_LETTER + ')))';
  };
}
