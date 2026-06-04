"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from "sonner"
import { StatusType } from "@prisma/client"
type Props = {
  id: string
  type: string
  status: StatusType
}

const StatusButton = ({ id, type,status }: Props) => {

  // console.log(id,type,status)
  const isEdit = true
  const handleTrash = async () => {
        const payload = {
            status:"TRASH",
        }
    const endpoint = isEdit
      ? `/api/${type}/${id}`
      : `/api/${type}`

    const method = isEdit
      ? "PATCH"
      : "POST"
    try {
      const res = await fetch(endpoint, {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      })
      const data = await res.json()

      toast.success(data.message || "Task Successful")

      // router.push("/event")

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      console.log(`${type} Trashed`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Button
        variant="destructive"
        onClick={handleTrash}
        className='cursor-pointer'
      >
        <Trash2 className=" h-4 w-4 " />
        Move To {status}
      </Button></div>
  )
}

export default StatusButton



    // {isEdit && <StatusButton id={id} type="song" status="TRASH" />}
