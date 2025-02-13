import App from "@/client/views/_app";
import "./globals.css";
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