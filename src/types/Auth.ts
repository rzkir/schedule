export enum Role {
  USER = "user",
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  photo_url?: string;
  updatedAt: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  getDashboardUrl: (userRole: string) => string;
  forgotPassword: (email: string) => Promise<void>;
  showInactiveModal: boolean;
  setShowInactiveModal: (show: boolean) => void;
}
