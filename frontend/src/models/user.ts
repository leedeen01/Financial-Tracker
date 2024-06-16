export interface User {
  _id?: string;
  username: string;
  email: string;
  friendlist: string[];
  friendRequest: string[];
  __v?: number;
}
