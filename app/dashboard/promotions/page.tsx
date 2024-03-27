"use client"
import promotionAPI from "@/api/promotion";
import TablePromotion from "@/components/Tables/TablePromotion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PromotionWithStoreName } from "@/types/promotion";
import storeAPI from "@/api/store";
import Select from "react-select";


const Promotion = () => {
  const { data: session, status } = useSession()
  const [storeOptions, setStoreOptions] = useState<{label: string, value: number}[]>([]); 
  const [selectedStore, setSelectedStore] = useState<{label: string, value:number}>({
    label: "All",
    value: 0
  });
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
      q: q,
      store_id: selectedStore.value
    })
    setPromotions(resp.data)
    setMetaData(resp.meta)
  }

  useEffect(() => {
    getPromotions()
  }, [metaData.current_page, selectedStore.value])
  
  const getStores = async () => {
    const token = session?.user?.token as string;
    const resp = await storeAPI.getStoresList(token);
    
    let storeOptions = resp.map(store => {
      return {
        label: store.name,
        value: store.store_id
      }
    })
    
    setStoreOptions(
      [
        {
          label: "All",
          value: 0
        },
        ...storeOptions
      ]
    );
  }

  useEffect(() => {
    getStores();
  }, [])

  return (
    <>
      <Link href={"/dashboard/promotions/add"}>
        <button
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray">
            Add promotion
        </button>
      </Link>
      <div className="mb-4.5">
        <label className="mb-3 block text-black dark:text-white">
          Store 
        </label>
        <Select
          options={storeOptions}
          onChange={(data) => {
            setSelectedStore(data as {label: string, value: number})
          }}
        />
      </div>
      <TablePromotion 
        promotions={promotions}
        setPromotions={setPromotions}
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