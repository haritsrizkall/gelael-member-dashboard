"use client"

import { useEffect, useState } from "react";
import Modal, { ModalProps } from "./Modal";
import Button from "../Button";
import promotionItemAPI from "@/api/promotionItem";
import { useSession } from "next-auth/react";
import { Promotion } from "@/types/promotion";
import { PromotionItem } from "@/types/promotionItem";
import uploadAPI from "@/api/upload";
import { z } from "zod";
import ErrorText from "../ErrorText";

interface EditPromotionItemModalProps extends ModalProps {
  setPromotionItems: (promotionItems: any) => void;
  promotionItem: PromotionItem;
  promotionItems: PromotionItem[];
}

const EditPromotionItemModal = (props: EditPromotionItemModalProps) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [defaultImage, setDefaultImage] = useState<string>("" as string);
  const [loading , setLoading] = useState(false);
  const [formError, setFormError] = useState({
    product_name: "",
    price: "",
    discount: "",
    id: "",
    image: ""
  });

  const cleanErrorForm = () => {
    setFormError((prev) => {
      return {
        product_name: "",
        price: "",
        discount: "",
        id: "",
        image: ""
      }
    });
  }
  
  const updatePromotionItemSchema = z.object({
    product_name: z.string().min(1),
    price: z.number().min(1),
    discount: z.number().min(1).max(100),
    id: z.number(),
    image: z.string()
  });
  const { data: session} = useSession();

  useEffect(() => {
    setProductName(props.promotionItem.product_name)
    setProductPrice(props.promotionItem.price.toString())
    setDiscount(props.promotionItem.discount.toString())
    setDefaultImage(props.promotionItem.image ? props.promotionItem.image : "" as string)
  },[props.promotionItem.promotion_item_id])
  
  const handleSubmit = async () => {
    try {
      setLoading(true)
      cleanErrorForm()
      
      const newPromotionItem = {
        product_name: productName,
        price: parseInt(productPrice),
        discount: parseInt(discount),
        id: props.promotionItem.promotion_item_id,
        image: defaultImage.split("/").pop() as string
      }

      const result = updatePromotionItemSchema.safeParse(newPromotionItem);
      if (!result.success) {
        const errors = result.error.format();
        console.log("Errors ", errors);
        setFormError({
          product_name: errors?.product_name?._errors[0]!,
          price: errors?.price?._errors[0]!,
          discount: errors?.discount?._errors[0]!,
          id: errors?.id?._errors[0]!,
          image: errors?.image?._errors[0]!
        });
        setLoading(false);
        return;
      }

      const token = session?.user?.token as string

      if (image) {
        const respImage = await uploadAPI.upload(token, {file: image as File})
        newPromotionItem.image = respImage.data.filename.split("/").pop() as string
      }

      const promotionItem = await promotionItemAPI.updatePromotionItem(token, newPromotionItem)

      console.log("resp ", promotionItem)
      // update promotion items
      const newPromotionItems = props.promotionItems.map((item: PromotionItem) => {
        if (item.promotion_item_id === newPromotionItem.id) {
          return promotionItem
        }
        return item
      })
      props.setPromotionItems(newPromotionItems)
      props.onClose()
      alert("Promotion Item updated successfully")
    }catch (error) {
      console.log(error)
      alert("Failed to update promotion item")
    }finally {
      setLoading(false)
    }
  }

  return (
    <Modal {...props} size="md">
      <>
      <div className="">
        <h1 className="text-center text-xl font-medium mb-10">Edit Promotion Item</h1>
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
          <ErrorText>{formError.product_name}</ErrorText>
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Image (Kosongkan jika tidak ingin mengganti gambar)
          </label>
          <input
            required
            onChange={(e) => setImage(e.target.files?.[0])}
            type="file"
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />  
          <ErrorText>{formError.image}</ErrorText>
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
          <ErrorText>{formError.price}</ErrorText>
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
          <ErrorText>{formError.discount}</ErrorText>
        </div>
      </div>
      <div>
        <Button
          text="Edit Promotion Item"
          onClick={handleSubmit}
          isLoading={loading}
        />
      </div>
      </>
    </Modal>
  )
}

export default EditPromotionItemModal