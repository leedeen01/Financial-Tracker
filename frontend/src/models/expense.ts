export const categories = [
  {
    name: "Food",
    background: "rgba(75, 192, 192, 0.2)",
    border: "rgba(75, 192, 192, 1)",
  },
  {
    name: "Groceries",
    background: "rgba(54, 162, 235, 0.2)",
    border: "rgba(54, 162, 235, 1)",
  },
  {
    name: "Entertainment",
    background: "rgba(255, 206, 86, 0.2)",
    border: "rgba(255, 206, 86, 1)",
  },
  {
    name: "Utilities",
    background: "rgba(255, 99, 132, 0.2)",
    border: "rgba(255, 99, 132, 1)",
  },
];

export interface ExpenseJSON {
  _id: string;
  description: string;
  amount: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

// Function to convert ExpenseJSON to Expense
function convertExpense(expenseJSON: ExpenseJSON): Expense {
  return {
    _id: expenseJSON._id, // Assuming id is a number
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
