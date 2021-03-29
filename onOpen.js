function onOpen() {
  refreshVisibleBudgets(false);

  var entries = [
    {name: "Refresh Visible Budgets", functionName: "refreshVisibleBudgets"},
    {name: "Show All Budgets", functionName: "showAllBudgets"},
    {name: "Create New Budget", functionName: "createBudget"},
    {name: "Update Monthly Budget", functionName: "updateBudget"},
    {name: "Delete Budget", functionName: "deleteBudget"},
    {name: "Sort Monthly Transactions by Date", functionName: "sortTransactionsByDate"},
    {name: "Sort Monthly Transactions by Category", functionName: "sortTransactionsByCategory"}
  ];

  SpreadsheetApp.getActiveSpreadsheet().addMenu("Budgeteer Features", entries);
}
