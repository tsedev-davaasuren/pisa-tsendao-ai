// @ts-nocheck
import { authOptions } from "@/lib/auth";

// CommonJS require ашиглан NextAuth-ийг runtime дээр шууд ачаална
const NextAuth = require("next-auth").default || require("next-auth");

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };