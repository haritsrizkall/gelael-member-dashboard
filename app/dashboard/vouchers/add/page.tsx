"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import { useState } from "react";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import uploadAPI from "@/api/upload";
import voucherAPI from "@/api/voucher";

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

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const input = {
        title,
        description,
        type: selectedType.value,
        amount: parseInt(amount),
        expired_at: new Date(expired_at),
        start_at: new Date(start_at),
        count
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

      setTitle("")
      setDescription("")
      setExpiredAt("")
      setStartAt("")
      setAmount("")
      setCount(0)
      setImage(undefined)
    }catch (e) {
      console.log(e)
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
              Image
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
              Type
            </label>
            <Select
              options={typeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e as {label: string, value: string})}
            />
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