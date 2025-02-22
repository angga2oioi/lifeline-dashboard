import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "./globals.css";
import App from "@/client/views/_app";
import { cookies, headers } from "next/headers";
import { CSRF_TOKEN_COOKIE_NAME } from "@/global/utils/constant";
import { validateCookies } from "@/server/module/auth/auth.service";

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const cookieStore = await cookies()

  const nonce = requestHeaders.get("x-nonce");
  const csrf = cookieStore.get(CSRF_TOKEN_COOKIE_NAME)?.value;
  const { account } = await validateCookies(cookies);

  return (
    <html
      lang="en"
      data-mantine-color-scheme="light"
    >
      <body className="m-0">
        <App nonce={nonce} csrf={csrf} account={account}>
          <div className="h-screen w-screen overflow-auto">
            {children}
          </div>
        </App>
      </body>
    </html>
  );
}