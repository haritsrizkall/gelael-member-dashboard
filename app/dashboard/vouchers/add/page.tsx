"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import { useState } from "react";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import uploadAPI from "@/api/upload";
import voucherAPI from "@/api/voucher";
import { z } from "zod";
import ErrorText from "@/components/ErrorText";
import moment from "moment";
import { toUtcDate } from "@/utils/formatter";

const AddVoucher = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expired_at, setExpiredAt] = useState("");
  const [start_at, setStartAt] = useState("");
  const [amount, setAmount] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState<{label: string, value: string}[]>([
    {label: "Member", value: "MEMBER"},
    {label: "Umum", value: "UMUM"}
  ]);
  const [selectedType, setSelectedType] = useState<{label: string, value: string}>(typeOptions[0]);
  const [image, setImage] = useState<File | undefined>(undefined);
  const { data: session } = useSession()

  const [formError, setFormError] = useState({
    title: "",
    description: "",
    type: "",
    amount: "",
    expired_at: "",
    start_at: "",
    count: "",
    image: ""
  });

  const createVoucherSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.string(),
    amount: z.number().min(1),
    expired_at: z.coerce.date().refine((date) => date > new Date(), {
      message: "Expired date must be greater than today"
    }),
    start_at: z.coerce.date().refine((date) => {
      const today = moment().startOf("day").toDate()
      return date >= today
    }, {
      message: "Start date must be greater or equal than today"
    }),
    count: z.number().min(0),
    image: z.string()
  });

  const cleanErrorForm = () => {
    setFormError((prev) => {
      return {
        ...prev,
        title: "",
        description: "",
        type: "",
        amount: "",
        expired_at: "",
        start_at: "",
        count: "",
        image: ""
      }
    });
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      cleanErrorForm()
      const input = {
        title,
        description,
        type: selectedType.value,
        amount: parseInt(amount),
        expired_at: toUtcDate(expired_at).toDate(),
        start_at: toUtcDate(start_at).toDate(),
        count,
        image: "",
      }

      const result = createVoucherSchema.safeParse(input)
      if (!result.success) {
        const errors = result.error.format()
        console.log("Errors ", errors)
        setFormError({
          title: errors?.title?._errors[0]!,
          description: errors?.description?._errors[0]!,
          type: errors?.type?._errors[0]!,
          amount: errors?.amount?._errors[0]!,
          expired_at: errors?.expired_at?._errors[0]!,
          start_at: errors?.start_at?._errors[0]!,
          count: errors?.count?._errors[0]!,
          image: errors?.image?._errors[0]!
        })
        setLoading(false)
        return
      }

      if (!image) {
        setFormError((prev) => {
          return {
            ...prev,
            image: "Image is required"
          }
        })
        setLoading(false)
        return
      }
    
      const token = session?.user?.token as string
      const resp = await uploadAPI.upload(token, {file: image as File})

      const voucherInput = {
        ...input,
        image: resp.data.filename.split("/").pop() as string
      }

      const respVoucher = await voucherAPI.createVoucher(token, voucherInput)
      console.log("RESP VOUCHER", respVoucher)

      alert("Voucher successfully created!")

      cleanErrorForm()
      setTitle("")
      setDescription("")
      setExpiredAt("")
      setStartAt("")
      setAmount("")
      setCount(0)
      setImage(undefined)
    }catch (e) {
      console.log(e)
      setLoading(false)
      alert("Failed to create voucher")
    }finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Breadcrumb 
        pageName="Add Voucher"
        parent={{name: "Vouchers", link: "/dashboard/vouchers"}}
      />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Title
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <ErrorText>{formError.title}</ErrorText>
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
              <ErrorText>{formError.description}</ErrorText>
          </div>

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
            <ErrorText>{formError.image}</ErrorText>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Type
            </label>
            <Select
              options={typeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e as {label: string, value: string})}
            />
            <ErrorText>{formError.type}</ErrorText>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Amount
            </label>
              <input
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="amount"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorText>{formError.amount}</ErrorText>
          </div>

          {
            selectedType.value === "UMUM" && (
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Jumlah Voucher
                </label>
                  <input
                    required
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    type="number"
                    min={0}
                    placeholder="count"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <ErrorText>{formError.count}</ErrorText>
              </div>
            )
          }

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Start at
            </label>
            <div className="relative">
              <input
                required
                onChange={(e) => setStartAt(e.target.value)}
                value={start_at}
                type="date"
                className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorText>{formError.start_at}</ErrorText>
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
                value={expired_at}
                type="date"
                className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorText>{formError.expired_at}</ErrorText>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            text="Submit"
            isLoading={loading}
          />
          </div>
        </div>
      </div>
    </>
  )
}

export default AddVoucher