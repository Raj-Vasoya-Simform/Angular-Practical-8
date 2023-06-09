export class User {
  constructor(
    private email: string,
    private token: string,
    private localId: string,
    private expirationDate: Date
  ) {}

  get expireDate() {
    return this.expirationDate;
  }

  get userToekn() {
    return this.token;
  }

  get localID(){
    return this.localId
  }
}
