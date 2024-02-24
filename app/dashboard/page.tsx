import axios from "axios"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../api/auth/[...nextauth]/route"

async function getData() {
  const session = await getServerSession(authOptions)
  console.log("Session ", session)
  const resp = await axios.get("http://103.250.11.32/api/users/me", {
    headers:{
      Authorization: "Bearer " + session?.user.token
    }
  })
}

const MainDashboard: React.FC = () => {
  const data = getData()
  return (
    <></>
  )
}

export default MainDashboard