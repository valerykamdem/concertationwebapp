export interface TransferRequest {
  fromAccountNumber: string,
  toAccountNumber: string,
  amount: number,
  purpose: string,
  pinCode: string,
}
