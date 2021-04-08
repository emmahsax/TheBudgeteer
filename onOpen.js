function onOpen() {
  refreshVisibleBudgets(false);

  var entries = [
    {name: "Refresh Visible Budget Categories", functionName: "refreshVisibleBudgets"},
    {name: "Show All Budget Categories", functionName: "showAllBudgets"},
    {name: "Update Monthly Budget", functionName: "updateBudget"},
    {name: "Clear Current Month's Budgets", functionName: "clearCurrentBudgets"},
    {name: "Clear Future Months' Budgets", functionName: "clearFutureBudgets"},
    {name: "Copy Last Month's Budgets to Current Month", functionName: "copyLastMonthsBudgets"},
    {name: "Create Budget Category", functionName: "createBudget"},
    {name: "Delete Budget Category", functionName: "deleteBudget"},
    {name: "Sort Monthly Transactions by Date", functionName: "sortTransactionsByDate"},
    {name: "Sort Monthly Transactions by Category", functionName: "sortTransactionsByCategory"}
  ];

  SpreadsheetApp.getActiveSpreadsheet().addMenu("Budgeteer Features", entries);
}
