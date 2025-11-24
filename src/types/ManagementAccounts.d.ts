import { Timestamp } from "firebase/firestore";

interface ManagementAccounts {
  id: string;
  name: string;
  email: string;
  password: string;
  provider: string;
  type: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// type untuk management accounts
interface ManagementAccountsType {
  id: string;
  type: string;
  createdAt: Timestamp | null;
}

interface ManagementAccountsProvider {
  id: string;
  provider: string;
  createdAt: Timestamp | null;
}
