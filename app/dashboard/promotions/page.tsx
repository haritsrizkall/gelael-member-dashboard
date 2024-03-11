"use client"
import promotionAPI from "@/api/promotion";
import TablePromotion from "@/components/Tables/TablePromotion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PromotionWithStoreName } from "@/types/promotion";


const Promotion = () => {
  const { data: session, status } = useSession()
  const [promotions, setPromotions] = useState<PromotionWithStoreName[]>([])
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })
  const [query, setQuery] = useState("")

  const getPromotions = async (q?: string) => {
    const resp = await promotionAPI.getPromotionsWithStoreName(session?.user?.token as string, {
      page: metaData.current_page,
      page_size: metaData.page_size,
      q: q
    })
    console.log("PROMOTIONS", resp)
    setPromotions(resp.data)
    setMetaData(resp.meta)
  }

  useEffect(() => {
    getPromotions()
  }, [metaData.current_page])
  
  return (
    <>
      <Link href={"/dashboard/promotions/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add promotion
        </button>
      </Link>
      <TablePromotion 
        promotions={promotions}
        setQuery={setQuery}
        query={query}
        meta={metaData}
        nextFn={() => {
          if (metaData.current_page < metaData.total_page) {
            setMetaData({
              ...metaData,
              current_page: metaData.current_page + 1
            })
          }
        }}
        prevFn={() => {
          if (metaData.current_page > 1) {
            setMetaData({
              ...metaData,
              current_page: metaData.current_page - 1
            })
          }
        }}
      />
    </>
  )
}

export default Promotion;