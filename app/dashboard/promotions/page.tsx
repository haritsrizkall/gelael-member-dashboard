"use client"
import promotionAPI from "@/api/promotion";
import TablePromotion from "@/components/Tables/TablePromotion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Promotion } from "@/types/promotion";


const Promotion = () => {
  const { data: session, status } = useSession()
  const [promotions, setPromotions] = useState<Promotion[]>([])

  const getPromotions = async () => {
    const resp = await promotionAPI.getPromotions(session?.user?.token as string)
    setPromotions(resp)
  }

  useEffect(() => {
    getPromotions()
  }, [])
  
  return (
    <>
      <Link href={"/dashboard/promotions/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add promotion
        </button>
      </Link>
      <TablePromotion promotions={promotions} />
    </>
  )
}

export default Promotion;