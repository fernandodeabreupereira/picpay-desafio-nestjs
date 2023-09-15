import { ITransfer } from "../../models/transfer";

export abstract class TransferRepository {
  abstract transfer (data: ITransfer): Promise<void>;
}