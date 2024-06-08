import { TransactionItem } from "./transaction-item.model";

export interface Transaction {
  id?: number;
  customerEmail?: string;
  currency?: string;
  amount?: number;
  items?: TransactionItem[];
}
