import { INotify } from "../../models/notify";

export abstract class NotifyRepository {
  abstract send (data: INotify): Promise<void>;
}