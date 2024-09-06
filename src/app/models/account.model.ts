import { Operation } from "./operation.model";

export interface Account {
    id: string,
    accountType: number,
    balance: number,
    userId: string,
    accountNumber: string,
    operations: Operation[]
}

