// -----logged in user (/auth/me)
export interface IUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatar: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}
