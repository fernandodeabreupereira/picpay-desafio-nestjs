export interface IReturnLoggedInUser {
  readonly role: 'user' | 'seller';
  readonly full_name: string;
  readonly email: string;
  readonly balance: number;
}