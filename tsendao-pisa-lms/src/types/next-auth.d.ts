import { DefaultSession } from "next-auth";

export type UserRole = 
  | "STUDENT" 
  | "TEAM_LEADER" 
  | "METHODOLOGIST" 
  | "CLASS_TEACHER" 
  | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      makeupLimit: number;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    makeupLimit?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    makeupLimit?: number;
  }
}