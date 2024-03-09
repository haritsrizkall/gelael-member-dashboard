"use client"

import { useState } from "react";
import Modal, { ModalProps } from "./Modal";
import Button from "../Button";
import promotionItemAPI from "@/api/promotionItem";
import { useSession } from "next-auth/react";

interface AddPromotionItemModalProps extends ModalProps {
  setPromotionItems: (promotionItems: any) => void;
  promotionId: number;
}

const AddPromotionItemModal = (props: AddPromotionItemModalProps) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading , setLoading] = useState(false);
  const { data: session} = useSession();
 
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const newPromotionItem = {
        product_name: productName,
        price: parseInt(productPrice),
        discount: parseInt(discount),
        promotion_id: props.promotionId
      }
      const token = session?.user?.token as string
      const promotionItem = await promotionItemAPI.createPromotionItem(token, newPromotionItem)
      props.setPromotionItems((prev: any) => {
        if (prev) {
          return [...prev, promotionItem]
        }else {
          return [promotionItem]
        }
      })
      props.onClose()
      alert("Promotion Item added successfully")
    }catch (error) {
      console.log(error)
      alert("Failed to add promotion item")
    }finally {
      setLoading(false)
    }
  }

  return (
    <Modal {...props} size="md">
      <>
      <div className="">
        <h1 className="text-center text-xl font-medium mb-10">Add Promotion Item</h1>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Product Name
          </label>
          <input
            required
            onChange={(e) => setProductName(e.target.value)}
            value={productName}
            type="text"
            placeholder="Ayam"
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
          <label className="mb-3 block text-black dark:text-white">
            Product Price
          </label>
          <input
            required
            onChange={(e) => setProductPrice(e.target.value)}
            value={productPrice}
            type="number"
            placeholder="100000"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Discount
          </label>
          <input
            required
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            min={0}
            max={100}
            placeholder="10"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
      </div>
      <div>
        <Button
          text="Add Promotion Item"
          onClick={handleSubmit}
          isLoading={loading}
        />
      </div>
      </>
    </Modal>
  )
}

export default AddPromotionItemModal