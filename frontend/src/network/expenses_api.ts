import { Expense, FriendsExpenseRequestBody } from "../models/expense";
import { history } from "../models/gemini";
import { User } from "../models/user";
import { Category } from "../models/category";
import { Account } from "../models/account";

// const website = "http://localhost:6969";
const website = "https://financial-tracker-mtpk.onrender.com";

//login/signup/logout related
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
    credentials: "include",
  });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
  picture: string;
  currency: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData(`${website}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",

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
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData(`${website}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export interface userInput {
  username: string;
  email: string;
  currency: string;
  profileImage: string;
}

export async function updateUser(
  userId: string,
  user: userInput,
): Promise<User> {
  const response = await fetchData(`${website}/api/users/updateUser/` + userId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("API Error:", error);
    throw new Error(error);
  }

  return response.json();
}

export async function deleteUser(userId: string) {
  return await fetchData(`${website}/api/users/` + userId, {
    method: "DELETE",
    credentials: "include",
  });
}

//friends related
export async function sendRequest(
  userId: string,
  friendId: string
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/sendRequest/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendRequest: friendId }),
      credentials: "include",
    }
  );
  return response.json();
}

export async function deleteRequest(
  userId: string,
  friendId: string
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/deleteRequest/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendRequest: friendId }),
      credentials: "include",
    }
  );
  return response.json();
}

export async function acceptFriend(
  userId: string,
  friendId: string
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/acceptFriend/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newFriend: friendId }),
      credentials: "include",
    }
  );
  return response.json();
}

export async function deleteFriend(
  userId: string,
  friendId: string
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/deleteFriend/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendRequest: friendId }),
      credentials: "include",
    }
  );
  return response.json();
}

export async function searchUsersByUsername(username: string): Promise<User[]> {
  const response = await fetchData(
    `${website}/api/users/searchUsername/` + username,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

export async function searchUsersById(Id: string): Promise<User> {
  const response = await fetchData(`${website}/api/users/searchId/` + Id, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

//categories related
export async function fetchCategory(): Promise<Category[]> {
  const response = await fetchData(`${website}/api/categories`, {
    method: "GET",
    credentials: "include",
  });
  const categories: Category[] = await response.json();

  return categories;
}

export interface categoryInput {
  name: string;
  color: string;
  type: string;
  budget?: number;
}

export async function createCategory(category: Category): Promise<Category[]> {
  await fetchData(`${website}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
    credentials: "include",
  });
  const response = await fetchData(`${website}/api/categories`, {
    method: "GET",
    credentials: "include",
  });

  const categories: Category[] = await response.json();

  return categories;
}

export async function updateCategory(
  categoryId: string,
  category: categoryInput
): Promise<Category> {
  const response = await fetchData(`${website}/api/categories/` + categoryId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
    credentials: "include",
  });
  return response.json();
}

export async function deleteCategory(categoryId: string) {
  return await fetchData(`${website}/api/categories/` + categoryId, {
    method: "DELETE",
    credentials: "include",
  });
}

//accounts related
export async function fetchAccount(): Promise<Account[]> {
  const response = await fetchData(`${website}/api/accounts`, {
    method: "GET",
    credentials: "include",
  });
  const accounts: Account[] = await response.json();

  return accounts;
}

export interface accountInput {
  name: string;
  amount: number;
  count?: number;
  currency?: string;
}

export async function createAccount(account: Account): Promise<Account[]> {
  await fetchData(`${website}/api/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
    credentials: "include",
  });
  const response = await fetchData(`${website}/api/accounts`, {
    method: "GET",
    credentials: "include",
  });

  const accounts: Account[] = await response.json();

  return accounts;
}

export async function updateAccount(
  accountId: string,
  account: accountInput
): Promise<Account> {
  const response = await fetchData(`${website}/api/accounts/` + accountId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
    credentials: "include",
  });
  return response.json();
}

export async function deleteAccount(accountId: string) {
  return await fetchData(`${website}/api/accounts/` + accountId, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function fetchStockPrice(accounts: Account[]) {
  const stockPrices = [];

  for (const account of accounts) {
    if (account.type === 'Stock') {
      const stock = account.name;
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${JSON.stringify(import.meta.env.VITE_STOCK_API_KEY)}`;
      //const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo";

      try {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          if (data['Meta Data'] && data['Time Series (Daily)']) {
            const lastRefreshedDate = data['Meta Data']['3. Last Refreshed'];
            const latestPrice = parseFloat(data['Time Series (Daily)'][lastRefreshedDate]['4. close']);

            stockPrices.push({
              stockName: stock,
              latestPrice: latestPrice
            });
          } else {
            console.error(`Invalid response data for stock: ${stock}`);
          }
        } else {
          console.error(`Failed to fetch data for stock: ${stock}`);
        }
      } catch (error) {
        console.error(`Error fetching data for stock: ${stock}`, error);
      }
    }
  }
  return stockPrices;
}

export async function fetchStockName(keyword: string) {
  const stockNames = [];
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${JSON.stringify(import.meta.env.VITE_STOCK_API_KEY)}`;
  //const url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo";

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      for (const d of data.bestMatches) {
        stockNames.push({
          symbol: d['1. symbol'],
          name: d['2. name'],
          region: d['4. region'],
        });
      }
    } else {
      console.error(`Failed to fetch stocks for keyword: ${keyword}`);
    }
  } catch (error) {
    console.error(`Error fetching stocks for keyword: ${keyword}`, error);
  }
  return stockNames;
}

export async function fetchCurrencies(currency: string, prevCurrency: string) {
  let currencyVal = 0;
  const url = `https://api.fxratesapi.com/latest?api_key=${JSON.stringify(import.meta.env.VITE_CURRENCY_API_KEY)}&base=${prevCurrency}&currencies=${currency}&resolution=1m&amount=1&places=6&format=json`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      currencyVal = data.rates[currency];
      console.log(currencyVal);
    } else {
      console.error(`Failed to fetch currency value for ${currency}`);
    }
  } catch (error) {
    console.error(`Error fetching currency value for ${currency}`, error);
  }
  return currencyVal;
}

//expenses related
export async function fetchExpense(): Promise<Expense[]> {
  const response = await fetchData(`${website}/api/expenses`, {
    method: "GET",
    credentials: "include",
  });
  const expenses: Expense[] = await response.json();

  return expenses;
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
    credentials: "include",
  });
  const response = await fetchData(`${website}/api/expenses`, {
    method: "GET",
    credentials: "include",
  });

  const expenses: Expense[] = await response.json();

  // Sort expenses by date in ascending order
  expenses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return expenses;
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
    credentials: "include",
  });
  return response.json();
}

export async function deleteExpense(expenseId: string) {
  return await fetchData(`${website}/api/expenses/` + expenseId, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function sendFriendExpense(
  userId: string,
  expense: FriendsExpenseRequestBody
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/sendExpenseRequest/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
      credentials: "include",
    }
  );
  return response.json();
}

export async function declineExpenseRequest(
  userId: string,
  expense: FriendsExpenseRequestBody
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/declineExpenseRequest/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
      credentials: "include",
    }
  );
  return response.json();
}

export async function acceptExpenseRequest(
  userId: string,
  expense: FriendsExpenseRequestBody
): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/acceptExpenseRequest/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
      credentials: "include",
    }
  );
  return response.json();
}

export async function settleExpenseRequest(userId: string): Promise<User> {
  const response = await fetchData(
    `${website}/api/users/settleExpenseRequest/` + userId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return response.json();
}

export async function getGeminiResponse(chatHistory: history[], value: string): Promise<string> {
  const response = await fetchData(`${website}/api/gemini/getSuggestion`, {
    method: "POST",
    body: JSON.stringify({
      chatHistory: chatHistory,
      message: value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return response.text();
}
