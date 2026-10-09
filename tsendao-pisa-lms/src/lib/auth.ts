import { NextAuthOptions } from "next-auth";

export className AuthOptions {
  // Нэвтрэх тохиргоо болон secret
}

export const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || "pisa-tsendao-secret-key-2026",
};