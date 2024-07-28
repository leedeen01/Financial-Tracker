export interface User {
  
  _id?: string;
  username: string;
  email: string;
  friendlist: string[];
  friendRequest: string[];
  topay: [];
  __v?: number;
  picture: string;
  currency: string;
  verified: boolean;
  createdAt: Date;
}

export const currencies = {
  emoji: {
    SGD: "🇸🇬",
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    JPY: "🇯🇵",
    CNY: "🇨🇳",
    KRW: "🇰🇷",
  },
  symbol: {
    SGD: "$",    // Singapore Dollar
    USD: "$",    // US Dollar
    EUR: "€",    // Euro
    GBP: "£",    // British Pound
    JPY: "¥",    // Japanese Yen
    CNY: "¥",    // Chinese Yuan
    KRW: "₩",    // South Korean Won
  },
};