"use client"
import promotionAPI from "@/api/promotion";
import storeAPI from "@/api/store";
import uploadAPI from "@/api/upload";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { z } from "zod";

const Promotion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageName, setImageName] = useState<string>("");
  const [color, setColor] = useState("#ffffff");
  const [expiredAt, setExpiredAt] = useState<string>("");
  const [defaultStoreId, setDefaultStoreId] = useState<number>(0);
  const [storeOptions, setStoreOptions] = useState<{label: string, value: number}[]>([]); 
  const [selectedStore, setSelectedStores] = useState<{label: string, value: number}>({} as {label: string, value: number});
  const { data: session, status } = useSession();
  const router = useRouter();

  const params = useParams();

  const getStores = async () => {
    const resp = await storeAPI.getStoresList(session?.user?.token as string);
    let storeOptions = resp.map(store => {
      if (resp.length > 0 && defaultStoreId == store.store_id) {
        setDefaultStoreId(store.store_id);
        console.log("defaultz store id", {label: store.name, value: store.store_id});
        setSelectedStores({label: store.name, value: store.store_id}); 
      }
      return {
        label: store.name,
        value: store.store_id
      }
    })

    setStoreOptions(storeOptions);

  }

  useEffect(() => {
    getStores()
  }, [defaultStoreId]);

  useEffect(() => {
    const getPromotion = async () => {
      const resp = await promotionAPI.getById(session?.user?.token as string, parseInt(params.id as string));
      if (resp) {
        setTitle(resp.title);
        setDescription(resp.description);
        setColor(resp.color);
        setExpiredAt(moment(resp.expired_at).format("YYYY-MM-DD"));
        setImageName(resp.image.split("/").pop() as string);
        setDefaultStoreId(resp.store_id);
      }
    }
    if (params.id) {
      getPromotion();
    }
  }, [params.id]);

  const createPromotionSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    color: z.string(),
    expired_at: z.date(),
    store_id: z.number()
  })

  const handleSubmit = async () => {
    try {
      const input = {
        title,
        description,
        image: "",
        color,
        expired_at: new Date(expiredAt),
        store_id: selectedStore.value
      }
      createPromotionSchema.parse(input)

      const token = session?.user?.token as string;
      // const resp = await uploadAPI.upload(token, { file: image as File });
  
      if (image == undefined) {
        const respPromotion = await promotionAPI.updatePromotion(token, {
          id: parseInt(params.id as string),
          title,
          description,
          image: imageName,
          color,
          expired_at: new Date(expiredAt),
          store_id: selectedStore.value
        });

        
        if (respPromotion) {
          alert("Promotion update successfully");
        }
      }else {
        const resp = await uploadAPI.upload(token, { file: image as File });
        const respPromotion = await promotionAPI.updatePromotion(token, {
          id: parseInt(params.id as string),
          title,
          description,
          image: resp.data.filename.split("/").pop() as string,
          color,
          expired_at: new Date(expiredAt),
          store_id: selectedStore.value
        });
        
        if (respPromotion) {
          alert("Promotion update successfully");
        }
      }      
      setTitle("");
      setDescription("");
      setImage(undefined);
      setColor("");
      setExpiredAt("");

      router.push("/dashboard/promotions");
    }catch (error) {
      console.log(error);
      alert("Failed to add promotion");
    }
  }

  return  (
    <>
      <Breadcrumb 
        pageName="Edit Promotion" 
        parent={{name: "Promotions", link: "/dashboard/promotions"}}/>
      <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Promotions
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
                  <label className="mb-3 block text-black dark:text-white">
                    Store 
                  </label>
                  <Select
                    options={storeOptions}
                    onChange={(data) => {
                      setSelectedStores((prev) => {
                        return {
                          label: data?.label as string,
                          value: data?.value as number
                        }
                      })
                    }}
                    defaultValue={storeOptions.find(store => {
                      console.log("store", store.value);
                      console.log("default store id", defaultStoreId);
                      return store.value == defaultStoreId
                    })}
                    value={selectedStore}
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
                    Color
                  </label>
                  <input
                    onChange={(e) => setColor(e.target.value)}
                    type="color"
                    value={color}
                    placeholder="#FFFFF"
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

export default Promotion;
