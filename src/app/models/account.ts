export class Account {
  id?: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;

  constructor(
    id: number,
    userName: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    userRole: string
  ) {
    this.id = id;
    this.userName = userName;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userRole = userRole;
  }
}

