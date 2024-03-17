"use client"
import bannerAPI from "@/api/banner"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableBanner from "@/components/Tables/TableBanner"
import { Banner } from "@/types/banner"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

const Banners = () => {
  const { data: session, status } = useSession()
  const [banners, setBanners] = useState<Banner[]>([])
  

  const getBanners = async () => {
    const resp = await bannerAPI.getBanners(session?.user?.token as string, 1, 10)
    console.log("Banner ", resp)
    setBanners(resp)
  }

  useEffect(() => {
    getBanners()
  }, [])
  
  return (
    <>
      <Breadcrumb pageName="Banners" />
        <Link href={"/dashboard/banners/add"}>
          <button
            className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
              Add Banner
          </button>
        </Link>
        <TableBanner banners={banners} setBanners={setBanners} />
    </>
  )
}

export default Banners
