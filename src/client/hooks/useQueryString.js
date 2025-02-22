//@ts-check

"use client"

import { useCallback } from "react"

const useQueryString = (searchParams) => {

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    return { createQueryString }
}

export default useQueryString