export class Account {
    constructor(
      public id: string,
      public accountType: number,
      public balance: number,
      public userId: string
    ) {}
  }

export class User
{
    constructor(
      public id: string,
      public email: string,
      public civilStatus:string,
      public firstName: string,
      public lastName: string
  ){}
}

  