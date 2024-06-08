import { Account } from "./account";
import { Address } from "./address";

export interface Customer {
  id: number;
  phone: string;
  address: Address;
  account: Account;
}
