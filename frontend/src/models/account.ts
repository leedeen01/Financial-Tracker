export interface Account {
    _id: string;
    name: string;
    amount: number;
    type: string;
    count?: number;
}