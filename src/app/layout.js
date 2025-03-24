import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "./globals.css";
import App from "@/client/views/_app";
import { cookies, headers } from "next/headers";
import { validateCookies } from "@/server/module/auth/auth.service";

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce");
  
  const { account } = await validateCookies(cookies);

  return (
    <html
      lang="en"
      data-mantine-color-scheme="light"
    >
      <body className="m-0">
        <App nonce={nonce} account={account}>
          <div className="h-screen w-screen overflow-auto">
            {children}
          </div>
        </App>
      </body>
    </html>
  );
}