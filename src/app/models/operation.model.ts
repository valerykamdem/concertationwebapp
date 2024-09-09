export class Operation {
    constructor(
        public id:string,
        public referenceNumber: string,
        public operationType: number,
        public amount: number,
        public operationDate: Date,
        public description : string,
        public accountId : string,
        public accountNumber : string,
        public relatedAccountNumber : string,
        public relatedAccountUser : string,
        public itendedUse : string,
        public balanceAfterBooking : number,
        public status : string,
    ) {}
  }
  