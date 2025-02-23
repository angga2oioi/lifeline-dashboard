//@ts-check

"use client"

import { useCallback } from "react"

const useQueryString = (searchParams) => {

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString())
            if(!value){
                params.delete(name);

            }else{
                params.set(name, value)
            }

            return params.toString()
        },
        [searchParams]
    )

    return { createQueryString }
}

export default useQueryString