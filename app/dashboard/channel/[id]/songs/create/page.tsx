import SongBasicForm from '@/components/song/form/SongBasicForm'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function Page() {

  return (
    <SongBasicForm/>
  )
}