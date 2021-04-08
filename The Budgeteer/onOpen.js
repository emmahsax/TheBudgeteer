function onOpen() {
  refreshVisibleCategories(false);

  var entries = [
    {name: "Refresh Visible Categories", functionName: "refreshVisibleCategories"},
    {name: "Show All Categories", functionName: "showAllCategories"},
    {name: "Update Category Budget", functionName: "updateBudget"},
    {name: "Clear Current Month's Budgets", functionName: "clearCurrentBudgets"},
    {name: "Clear Future Months' Budgets", functionName: "clearFutureBudgets"},
    {name: "Copy Last Month's Budgets to Current Month", functionName: "copyLastMonthsBudgets"},
    {name: "Create Category", functionName: "createCategory"},
    {name: "Delete Category", functionName: "deleteCategory"},
    {name: "Sort Monthly Transactions by Date", functionName: "sortTransactionsByDate"},
    {name: "Sort Monthly Transactions by Category", functionName: "sortTransactionsByCategory"}
  ];

  SpreadsheetApp.getActiveSpreadsheet().addMenu("Budgeteer Features", entries);
}
