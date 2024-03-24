"use client"
import promotionAPI from "@/api/promotion";
import promotionItemAPI from "@/api/promotionItem";
import storeAPI from "@/api/store";
import uploadAPI from "@/api/upload";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Button";
import ErrorText from "@/components/ErrorText";
import AddPromotionItemModal from "@/components/Modals/AddPromotionItemModal";
import TablePromotionItem from "@/components/Tables/TablePromotionItem";
import { PromotionItem } from "@/types/promotionItem";
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
  const [backgroundColor, setBackgroundColor] = useState("#ffffff" as string);
  const [startAt, setStartAt] = useState<string>("");
  const [expiredAt, setExpiredAt] = useState<string>("");
  const [defaultStoreId, setDefaultStoreId] = useState<number>(0);
  const [storeOptions, setStoreOptions] = useState<{label: string, value: number}[]>([]); 
  const [selectedStore, setSelectedStores] = useState<{label: string, value: number}>({
    label: "",
    value: 0
  } as {label: string, value: number});
  const [addPromotionItem, setAddPromotionItem] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [promotionId, setPromotionId] = useState<number>(0);
  const [errorForm, setErrorForm] = useState({
    title: "",
    description: "",
    image: "",
    color: "",
    background_color: "",
    expiredAt: "",
    store_id: "",
    start_at: ""
  });
  const cleanErrorForm = () => {
    setErrorForm({
      title: "",
      description: "",
      image: "",
      color: "",
      background_color: "",
      expiredAt: "",
      store_id: "",
      start_at: ""
    });
  }

  // State Promotion Item
  const [promotionItems, setPromotionItems] = useState<PromotionItem[]>([]);
  const [metaData, setMetaData] = useState({
    current_page: 1,
    page_size: 15,
    total: 0,
    total_page: 0
  })

  const { data: session } = useSession();

  const params = useParams();

  const getStores = async () => {
    const resp = await storeAPI.getStoresList(session?.user?.token as string);
    let storeOptions = resp.map(store => {
      if (resp.length > 0 && defaultStoreId == store.store_id) {
        setDefaultStoreId(store.store_id);
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

  
  const getPromotion = async () => {
    setPromotionId(parseInt(params.id as string));
    const resp = await promotionAPI.getById(session?.user?.token as string, parseInt(params.id as string));
    if (resp) {
      setTitle(resp.title);
      setDescription(resp.description);
      setColor(resp.color);
      setBackgroundColor(resp.background_color);
      setExpiredAt(moment(resp.expired_at).format("YYYY-MM-DD"));
      setImageName(resp.image.split("/").pop() as string);
      setDefaultStoreId(resp.store_id);
      setPromotionItems(resp.promotion_item as PromotionItem[]);
      setPromotionId(resp.id);
      setStartAt(moment(resp.start_at).format("YYYY-MM-DD"));
    }
  }

  const getPromotionItems = async () => {
    try {
      console.log("promotion id", promotionId)
      const token = session?.user?.token as string
      const resp = await promotionItemAPI.getPromotionItemsByPromotionID(token, {
        promotion_id: parseInt(params.id as string),
        page: metaData.current_page,
        page_size: metaData.page_size,
      })
      setPromotionItems(resp.data)
      setMetaData(resp.meta)
      console.log("promotion items", promotionItems)
    } catch (error) {
      alert("Failed to get promotion items")
      console.log(error)
    }
  }

  useEffect(() => {
    if (params.id) {
      getPromotion();
      getPromotionItems();
    }
  }, [params.id]);

  const createPromotionSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string(),
    color: z.string(),
    background_color: z.string(),
    start_at: z.coerce.date(),
    expired_at: z.coerce.date().refine((data) => {
      return data > new Date();
      }, {
      message: "Expired at must be greater than today"
    }),
    store_id: z.number().nonnegative().refine((store_id) => store_id !== 0, {
      message: "Store is required"
    }),
  })

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const input = {
        title,
        description,
        image: "",
        background_color: backgroundColor,
        color,
        expired_at: new Date(expiredAt),
        store_id: selectedStore.value,
        start_at: new Date(startAt)
      }
      const result = createPromotionSchema.safeParse(input);
      console.log("Result ", result);
      if (!result.success) {
        const errors = result.error.format();
        setErrorForm({
          title: errors?.title?._errors[0]!,
          description: errors?.description?._errors[0]!,
          image: errors?.image?._errors[0]!,
          color: errors?.color?._errors[0]!,
          expiredAt: errors?.expired_at?._errors[0]!,
          store_id: errors?.store_id?._errors[0]!,
          start_at: errors?.start_at?._errors[0]!,
          background_color: errors?.background_color?._errors[0]!
        })
        setLoading(false);
        return;
      }

      const token = session?.user?.token as string;

      if (image == undefined) {
        const respPromotion = await promotionAPI.updatePromotion(token, {
          id: parseInt(params.id as string),
          title,
          description,
          image: imageName,
          color,
          background_color: backgroundColor,
          expired_at: new Date(expiredAt),
          store_id: selectedStore.value,
          start_at: new Date(startAt)
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
          background_color: backgroundColor,
          expired_at: new Date(expiredAt),
          store_id: selectedStore.value,
          start_at: new Date(startAt)
        });
        
        if (respPromotion) {
          alert("Promotion update successfully");
        }
      }      
      cleanErrorForm();
    }catch (error) {
      console.log(error);
      alert("Failed to add promotion");
    }finally {
      setLoading(false);
    }
  }

  return  (
    <>
      <AddPromotionItemModal isOpen={addPromotionItem} setPromotionItems={setPromotionItems} onClose={() => setAddPromotionItem(false)} promotionId={parseInt(params.id as string)} />
      <Breadcrumb 
        pageName="Edit Promotion" 
        parent={{name: "Promotions", link: "/dashboard/promotions"}}/>
      <div className="">
          {/* <!-- Edit Form --> */}
          <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Edit Promotion</h2>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-10">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit Promotions
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
                  <ErrorText>{errorForm.title}</ErrorText>
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
                    <ErrorText>{errorForm.description}</ErrorText>
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
                      return store.value == defaultStoreId
                    })}
                    value={selectedStore}
                  />
                  <ErrorText>{errorForm.store_id}</ErrorText>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image (Kosongkan jika tidak ingin update image - jpg, jpeg, png)
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
                  <ErrorText>{errorForm.color}</ErrorText>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Background Color
                  </label>
                  <input
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    type="color"
                    value={backgroundColor}
                    placeholder="#FFFFF"
                  />
                  <ErrorText>{errorForm.backgroundColor}</ErrorText>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Start at
                  </label>
                  <div className="relative">
                    <input
                      required
                      onChange={(e) => setStartAt(e.target.value)}
                      value={startAt}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorText>{errorForm.start_at}</ErrorText>
                  </div>
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
                    <ErrorText>{errorForm.expiredAt}</ErrorText>
                  </div>
                </div>
                <Button
                  text="Edit Promotion"
                  onClick={handleSubmit}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>

          <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Promotion Item</h2>
          <button
            className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray"
            onClick={() => setAddPromotionItem(true)}
          >
              Add promotion item
          </button>
          <div>
            <TablePromotionItem 
              promotionItems={promotionItems} 
              setPromotionItems={setPromotionItems}
              meta={metaData}
              nextFn={() => {
                if (metaData.current_page < metaData.total_page) {
                  setMetaData((prev) => {
                    return {
                      ...prev,
                      current_page: prev.current_page + 1
                    }
                  })
                }
              }}
              prevFn={() => {
                if (metaData.current_page > 1) {
                  setMetaData((prev) => {
                    return {
                      ...prev,
                      current_page: prev.current_page - 1
                    }
                  })
                }
              }}
            />
          </div>
      </div>
    </>
  )
}

export default Promotion;
