"use client"
import uploadAPI from "@/api/upload"
import voucherAPI, { InputCreateVoucher } from "@/api/voucher"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import moment from "moment"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"


const Voucher = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | undefined>(undefined)
  const [imageName, setImageName] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const params = useParams() 
  const { data: session } = useSession()
  const token = session?.user?.token as string

  const getVoucher = async () => {
    const resp = await voucherAPI.getById(token, parseInt(params.id as string))
    if (resp) {
      console.log(resp)
      setTitle(resp.title)
      setDescription(resp.description)
      setImageName(resp.image.split('/').pop() as string)
      setExpiredAt(moment(resp.expired_at).format('YYYY-MM-DD'))
    }
  }

  useEffect(() => {
    if (params.id) {
      getVoucher()
    }
  }, [])

  const updatePromotionSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    expired_at: z.date(),
  })

  const handleSubmit = async () => {
    const token = session?.user?.token as string
    try {
      const input = {
        title,
        description,
        image: "",
        expired_at: new Date(expiredAt),
      }
      updatePromotionSchema.parse(input)
      console.log(input)
      console.log("token", token)
      if (image == undefined) {
        const resp = await voucherAPI.updateVoucher(token, {
          id: parseInt(params.id as string),
          title,
          description,
          image: imageName,
          expired_at: new Date(expiredAt),
        })
        if (resp) {
          console.log(resp)
          alert('Voucher updated successfully')
        }
      }else {
        const resp = await uploadAPI.upload(token, { file: image as File })
        const respVoucher = await voucherAPI.updateVoucher(token, {
          id: parseInt(params.id as string),
          title,
          description,
          image: resp.data.filename.split('/').pop() as string,
          expired_at: new Date(expiredAt),
        })
  
        if (respVoucher) {
          console.log(respVoucher)
          alert('Voucher updated successfully')
        }
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update voucher");
    }
   
  }

  return (
    <>
      <Breadcrumb
        pageName="Edit Voucher"
        parent={{ name: "Vouchers", link: "/dashboard/vouchers" }}
      />
      <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit Voucher
              </h3>
            </div>
            <div>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="title"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                    <input
                      required
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      type="text"
                      placeholder="description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image (Kosongkan jika tidak ingin update image)
                  </label>
                  <input
                    required
                    onChange={(e) => setImage(e.target.files?.[0])}
                    type="file"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />  
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Expired at
                  </label>
                  <div className="relative">
                    <input
                      required
                      onChange={(e) => setExpiredAt(e.target.value)}
                      value={expiredAt}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  Edit Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Voucher