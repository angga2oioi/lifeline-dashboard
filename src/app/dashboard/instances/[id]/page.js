"use server"

import DashboardInstanceDetailViews from "@/client/views/DashboardInstanceDetail"
export default async function DashboardInstanceDetailPage({ params }) {

    const query = await params

    return (
        <DashboardInstanceDetailViews params={query} />
    )
}
