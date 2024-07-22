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
  userId?: string | undefined;
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
  sendMoneyName: string;
  receiveMoney: string;
  receiveMoneyName: string;
  description: string;
  date: Date;
  amount: string;
  currency: string;
  category: string;
}
