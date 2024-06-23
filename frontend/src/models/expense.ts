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

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FriendsExpenseRequestBody {
  status: string;
  sendMoney: string;
  receiveMoney: string;
  description: string;
  date: Date;
  amount: number;
  category: string;
  [key: string]: string | Date | number; // Index signature
}
