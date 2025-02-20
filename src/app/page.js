"use server"
import { validateCookies } from "@/server/module/auth/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  
  const { account } = await validateCookies(cookies);
  if(!account){
    redirect("/login")
  }
  redirect("/dashboard")
  
}
