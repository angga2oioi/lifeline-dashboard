//@ts-check
import React from "react"
import { TextInput } from "@mantine/core"
import { FaSearch } from "react-icons/fa"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useQueryString from "@/client/hooks/useQueryString"

const SearchInput = ({ ...props }) => {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { createQueryString } = useQueryString(searchParams)

    const handleSearch = (e) => {
        router.push(pathname + '?' + createQueryString('search', e))
    }

    return (
        <TextInput
            {...props}
            rightSection={<FaSearch />}
            onKeyDown={(e) => {
                if (e?.key === "Enter") {
                    handleSearch(e?.currentTarget?.value)
                }
            }}
        />
    )
}

export default SearchInput