import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    status: string;
    backofficeRole?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      status: string;
      backofficeRole?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    status: string;
    backofficeRole?: string;
  }
}
