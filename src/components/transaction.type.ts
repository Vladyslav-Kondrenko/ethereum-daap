export interface Transaction {
  hash: string;
  from: string;
  to: string | null | undefined;
  value: number;
}