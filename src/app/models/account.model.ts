import { Operation } from "./operation.model";
import {User} from "./user.model";

export interface Account {
    id: string,
    accountType: number,
    balance: number,
    userId: string,
    accountNumber: string,
    operations: Operation[],
    user: User,
}

export class Account implements Account {}
