import { Expense, mapExpenseJSONToExpense } from "../models/expense";
import { User } from "../models/user";

//const website = "http://localhost:6969";
const website = "https://financial-tracker-mtpk.onrender.com";
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

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData(`${website}/api/users`, {
    method: "GET",
  });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData(`${website}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData(`${website}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData(`${website}/api/users/logout`, {
    method: "POST",
  });
}

export async function fetchExpense(): Promise<Expense[]> {
  const response = await fetchData(`${website}/api/expenses`, {
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
  await fetchData(`${website}/api/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  const expenses = await fetchData(`${website}/api/expenses`, {
    method: "GET",
  });
  const expensesJSON = await expenses.json();
  return mapExpenseJSONToExpense(expensesJSON);
}

export async function updateExpense(
  expenseId: string,
  expense: expenseInput
): Promise<Expense> {
  const response = await fetchData(`${website}/api/expenses/` + expenseId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return response.json();
}

export async function deleteExpense(expenseId: string) {
  console.log(expenseId);
  return await fetchData(`${website}/api/expenses/` + expenseId, {
    method: "DELETE",
  });
}