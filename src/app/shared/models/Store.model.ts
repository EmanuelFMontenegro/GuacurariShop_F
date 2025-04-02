import { User } from "./User.model";

  export interface Store {
    token: string | null;
    user: User | null;
  }
  