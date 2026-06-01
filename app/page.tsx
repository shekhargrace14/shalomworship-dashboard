import { redirect } from "next/navigation"
import Link from "next/link"

export default function Page() {
  redirect("/dashboard")
  return (
    <p>Please <Link href={"/auth/login"}>Login</Link> </p>
  )
}
