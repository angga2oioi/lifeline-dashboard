import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "./globals.css";
import App from "@/client/views/_app";
import { headers } from "next/headers";

export default async function RootLayout({ children }) {
  const requestHeaders = await headers(); // ✅ Await headers() first
  const nonce = requestHeaders.get("x-nonce");

  return (
    <html
      lang="en"
      data-mantine-color-scheme="light"
    >
      <body className="m-0">
        <App nonce={nonce} >
          <div className="h-screen w-screen overflow-auto">
            {children}
          </div>
        </App>
      </body>
    </html>
  );
}