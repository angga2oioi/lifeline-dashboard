import { validateCookies } from "@/server/module/auth/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
    const { account } = await validateCookies(cookies);
    if (!account) {
        redirect("/logout")
    }

    return (
        <>{children}</>
    );
}