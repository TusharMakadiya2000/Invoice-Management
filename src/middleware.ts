export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/project",
    // "/ourservices",
    // "/vehicles",
    "/users",
    "/invoices",
    "/invoice",
  ],
};
