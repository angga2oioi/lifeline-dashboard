"use server"

import DashboardProjectDetailViews from "@/client/views/DashboardProjectDetail"
export default async function DashboardProjectDetailPage({ params }) {

    const query = await params

    return (
        <DashboardProjectDetailViews params={query} />
    )
}
