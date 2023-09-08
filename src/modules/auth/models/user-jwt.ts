export interface IUserJWT {
  readonly id: string;
  readonly role: 'user' | 'seller';
  readonly full_name: string;
  readonly email: string;
}