import { Expense, mapExpenseJSONToExpense } from "../models/expense";
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

export async function fetchExpense(): Promise<Expense[]> {
  const response = await fetchData("http://localhost:6969/api/expenses", {
    method: "GET",
  });
  const expensesJSON = await response.json();

  return mapExpenseJSONToExpense(expensesJSON);
}

export interface expenseInput {
  description: string;
  amount: number;
  category: string;
}
export async function createExpense(expense: expenseInput): Promise<Expense[]> {
  await fetchData("http://localhost:6969/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  const expenses = await fetchData("http://localhost:6969/api/expenses", {
    method: "GET",
  });
  const expensesJSON = await expenses.json();
  return mapExpenseJSONToExpense(expensesJSON);
}

export async function updateExpense(
  expenseId: string,
  expense: expenseInput
): Promise<Expense> {
  const response = await fetchData(
    "http://localhost:6969/api/expenses/" + expenseId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }
  );
  return response.json();
}

export async function deleteExpense(expenseId: string) {
  console.log(expenseId);
  return await fetchData("http://localhost:6969/api/expenses/" + expenseId, {
    method: "DELETE",
  });
}
