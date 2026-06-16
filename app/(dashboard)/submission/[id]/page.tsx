"use client"

import { submission } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page(){

    const params = useParams()

    const id = params.id as string

    console.log(id,"id id id")

    const [submission, setSubmission] = useState<submission | null >(null)

    useEffect(()=>{
        async function load() {
            const res = await fetch(`/api/submission/${id}`)

            if(!res.ok){
                console.error("API Error", res.status)
                const text = await res.text()
                console.error(text)
                return
            }
            const data = await res.json()
            setSubmission(data.data)
        }
        if(id){
            load()
        }
    },[id])

    console.log(submission, "test")

    return(
        <>
            {submission?.name}
            {submission?.title}
            {submission?.type}
        </>
    )
}