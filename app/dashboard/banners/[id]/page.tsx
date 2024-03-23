"use client"

import bannerAPI from "@/api/banner";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Button";
import ErrorText from "@/components/ErrorText";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

const Banner = () => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const [errorForm, setErrorForm] = useState({
    image: ""
  });
  const params = useParams()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (image == undefined) {
        setErrorForm((prev) => {
          return {
            ...prev,
            image: "Image is required"
          }
        })
        setLoading(false)
        return
      }

      const token = session?.user?.token as string
      const resp = await bannerAPI.update(token, {id: parseInt(params.id as string), image: image as File})   

      if (resp) {
        alert("Banner updated successfully")
      }
    } catch (error) {
      console.log("Error adding banner", error)
      alert("Failed to add banner")
    } finally{
      setLoading(false) 
    }
  }

  return (
    <>
      <Breadcrumb 
        pageName="Edit Banner"
        parent={{name: "Banners", link: "/dashboard/banners"}}
      />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Edit Banner
            </h3>
          </div>

          
          <div className="p-6.5">
            <div className="mb-4.5">
              <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image (jpg, jpeg, png)
                  </label>
                  <input
                    required
                    onChange={(e) => setImage(e.target.files?.[0])}
                    type="file"
                    accept="image/jpg, image/jpeg, image/png, image/JPG, image/JPEG, image/PNG"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />  
                  <ErrorText>{errorForm.image}</ErrorText>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              isLoading={loading}
              text="Add Banner"
            />
          </div>  
        </div>
        <div>
        </div>
      </div>
    </>
  )
}

export default Banner;
