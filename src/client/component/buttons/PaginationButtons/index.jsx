//@ts-check
import useQueryString from "@/client/hooks/useQueryString"
import { Pagination } from "@mantine/core"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
const PaginationButtons = ({ total, value }) => {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { createQueryString } = useQueryString(searchParams)

    const handlePageChange = (e) => {
        router.push(pathname + '?' + createQueryString('page', e))
    }

    return (
        <>
            <Pagination total={total} value={value} onChange={handlePageChange} />
        </>
    )
}

export default PaginationButtons