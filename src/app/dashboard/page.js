"use server"

import { redirect } from "next/navigation"


export default async function DashboardPage() {
    redirect(`/dashboard/projects`)
    
}
