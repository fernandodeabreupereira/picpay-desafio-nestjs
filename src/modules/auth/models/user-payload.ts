export interface IUserPayload {
  readonly sub: string;
  readonly role: 'user' | 'seller';
  readonly full_name: string;
  readonly email: string;
  readonly iat?: string;
  readonly exp?: number;
}