export interface Account {
    userId: string | undefined;
    _id: string;
    name: string;
    amount: number;
    type: string;
    count?: number;
}