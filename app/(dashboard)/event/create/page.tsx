"use client"
import EventForm from '@/components/event/EventForm'
import React, { useEffect, useState } from 'react'



const page = () => {
    const [artists, setArtists] = useState([])
      useEffect(() => {
        fetchArtists();
      }, []);
      async function fetchArtists() {
    const res = await fetch(`/api/artist`)
    const data = await res.json()
    setArtists(data.data);
    
}
// console.log(artists, "look the loin, Oh my god")
  return (
    <div><EventForm artists={artists} /></div>
  )
}

export default page