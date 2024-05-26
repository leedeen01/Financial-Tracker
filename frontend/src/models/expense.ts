export interface ExpenseJSON {
  _id: string;
  description: string;
  amount: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Function to convert ExpenseJSON to Expense
function convertExpense(expenseJSON: ExpenseJSON): Expense {
  return {
    id: parseInt(expenseJSON._id), // Assuming id is a number
    description: expenseJSON.description,
    amount: parseFloat(expenseJSON.amount), // Parse amount to number
    category: expenseJSON.category,
    createdAt: expenseJSON.createdAt,
    updatedAt: expenseJSON.updatedAt,
  };
}

export function mapExpenseJSONToExpense(
  expenseJSONArr: ExpenseJSON[]
): Expense[] {
  return expenseJSONArr.map((expenseJSON) => convertExpense(expenseJSON));
}
