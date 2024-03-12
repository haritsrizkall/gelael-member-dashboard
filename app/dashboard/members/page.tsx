"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import TableMember from "../vouchers/TableMember"
import { useEffect, useRef, useState } from "react"
import { Member, MemberWithStoreName } from "@/types/member"
import memberAPI from "@/api/member"
import { useSession } from "next-auth/react"
import { debounce } from "lodash"

const Members = () => {
  const [members, setMembers] = useState<MemberWithStoreName[]>([])
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })
  const [query, setQuery] = useState("")
  const { data: session } = useSession()  

  const getData = async (q?: string) => {
    const token = session?.user?.token as string
    const resp = await memberAPI.getMembersWithStoreName(token, {
      page: metaData.current_page,
      page_size: metaData.page_size,
      q: q
    })
    setMembers(resp.data)
    setMetaData(resp.meta)
  }

  useEffect(() => {
    getData()
  }, [metaData.current_page])
  
  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      await getData(value)
    }, 500)
  ).current

  const setQueryDebounced = async (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }
  
  useEffect(() => {
    debouncedSearch.cancel()
  }, [debouncedSearch]);

  return (
    <>
      <Breadcrumb pageName="Members" />
      <TableMember
        members={members}
        setQuery={setQueryDebounced}
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

export default Members