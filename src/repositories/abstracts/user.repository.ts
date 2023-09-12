import { IUser } from "src/models/user";

export abstract class UserRepository {
  abstract create (data: IUser): Promise<IUser>;
  abstract findById (id: string): Promise<IUser>;
  abstract findByCPF (cpf: string): Promise<IUser>;
  abstract findByEmail (email: string): Promise<IUser>;
}