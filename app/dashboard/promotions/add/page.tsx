"use client";

import promotionAPI from "@/api/promotion";
import storeAPI from "@/api/store";
import uploadAPI from "@/api/upload";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Button";
import ErrorText from "@/components/ErrorText";
import { toUtcDate } from "@/utils/formatter";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { z } from "zod";

const AddPromotion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [color, setColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#323232" as string);
  const [expiredAt, setExpiredAt] = useState("");
  const [startAt, setStartAt] = useState("");
  const [storeOptions, setStoreOptions] = useState<{label: string, value: number}[]>([]); 
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStores] = useState<{label: string, value: number}>({
    label: "",
    value: 0
  } as {label: string, value: number});
  const [errorForm, setErrorForm] = useState({
    title: "",
    description: "",
    image: "",
    background_color: "",
    color: "",
    expiredAt: "",
    store_id: "",
    startAt: ""
  });
  const { data: session } = useSession() 

  const cleanErrorForm = () => {
    setErrorForm({
      title: "",
      description: "",
      image: "",
      background_color: "",
      color: "",
      expiredAt: "",
      store_id: "",
      startAt: ""
    });
  }

  const getStores = async () => {
    const resp = await storeAPI.getStoresList(session?.user?.token as string);
    let storeOptions = resp.map(store => {
      return {
        label: store.name,
        value: store.store_id
      }
    })

    setStoreOptions(storeOptions);
  }

  useEffect(() => {
    getStores()
  }, []);

  
  const createPromotionSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string(),
    background_color: z.string(),
    color: z.string(),
    start_at: z.coerce.date().refine((data) => {
      const today = moment().startOf('day').toDate();
      return data >= today;
      }, {
      message: "Start at must be greater or equal than today"
    }),
    expired_at: z.coerce.date().refine((data) => {
      const today = moment().startOf('day').toDate();
      return data > today;
      }, {
      message: "Expired at must be greater than today"
    }),
    store_id: z.number().nonnegative().refine((store_id) => store_id !== 0, {
      message: "Store is required"
    }),
  })

  const handleSubmit = async () => {
    // Add Promotion
    setLoading(true);
    cleanErrorForm();
    try {
      const input = {
        title,
        description,
        image: "",
        color,
        background_color: backgroundColor,
        expired_at: toUtcDate(expiredAt),
        start_at: toUtcDate(startAt),
        store_id: selectedStore.value
      }
      const result = createPromotionSchema.safeParse(input);
      console.log("Result ", result);
      if (!result.success) {
        const errors = result.error.format();
        console.log("Errors ", errors);
        setErrorForm({
          title: errors?.title?._errors[0]!,
          description: errors?.description?._errors[0]!,
          image: errors?.image?._errors[0]!,
          color: errors?.color?._errors[0]!,
          expiredAt: errors?.expired_at?._errors[0]!,
          store_id: errors?.store_id?._errors[0]!,
          startAt: errors?.start_at?._errors[0]!,
          background_color: errors?.background_color?._errors[0]!
        })
        setLoading(false);
        return;
      }

      if (!image) {
        setErrorForm((prev) => {
          return {
            ...prev,
            image: "Image is required"
          }
        })
        setLoading(false);
        return;
      }

      const token = session?.user?.token as string;
      const resp = await uploadAPI.upload(token, { file: image as File });
  
      const respPromotion = await promotionAPI.createPromotion(token, {
        title,
        description,
        image: resp.data.filename.split("/").pop() as string,
        color,
        expired_at: toUtcDate(expiredAt).toDate(),
        store_id: selectedStore.value,
        start_at: toUtcDate(startAt).toDate(),
        background_color: backgroundColor
      });
  
      if (respPromotion) {
        alert("Promotion added successfully");
      }
      
      setTitle("");
      setDescription("");
      setImage(undefined);
      setColor("#ffffff");
      setStartAt("");
      setExpiredAt("");
      cleanErrorForm();
    }catch (error) {
      console.log(error);
      alert("Failed to add promotion");
    }finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Breadcrumb 
        pageName="Add Promotion" 
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
                      setSelectedStores(data as {label: string, value: number})
                    }}
                  />
                  <ErrorText>{errorForm.store_id}</ErrorText>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image (jpg, png, jpeg)
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
                  <ErrorText>{errorForm.color}</ErrorText>
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
                    <ErrorText>{errorForm.startAt}</ErrorText>
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
                  onClick={handleSubmit}
                  text="Add Promotion"
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default AddPromotion;