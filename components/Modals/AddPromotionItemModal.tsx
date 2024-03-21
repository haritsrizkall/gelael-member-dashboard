"use client"

import { useState } from "react";
import Modal, { ModalProps } from "./Modal";
import Button from "../Button";
import promotionItemAPI from "@/api/promotionItem";
import { useSession } from "next-auth/react";
import uploadAPI from "@/api/upload";
import { z } from "zod";
import ErrorText from "../ErrorText";

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
  const [discountType, setDiscountType] = useState("percent");
  const [formError, setFormError] = useState({
    product_name: "",
    price: "",
    discount: "",
    promotion_id: "",
    image: ""
  });

  const cleanErrorForm = () => {
    setFormError((prev) => {
      return {
        product_name: "",
        price: "",
        discount: "",
        promotion_id: "",
        image: ""
      }
    });
  }

  const { data: session} = useSession();
  const createPromotionItemSchema = z.object({
    product_name: z.string().min(1),
    price: z.number().min(1),
    discount: z.number().min(1),
    promotion_id: z.number(),
    image: z.string()
  });
 
  const handleSubmit = async () => {
    try {
      setLoading(true)
      cleanErrorForm()
      const newPromotionItem = {
        product_name: productName,
        price: parseInt(productPrice),
        discount: parseInt(discount),
        promotion_id: props.promotionId,
        image: ""
      }
      const result = createPromotionItemSchema.safeParse(newPromotionItem);
      if (!result.success) {
        const errors = result.error.format();
        setFormError({
          product_name: errors?.product_name?._errors[0]!,
          price: errors?.price?._errors[0]!,
          discount: errors?.discount?._errors[0]!,
          promotion_id: errors?.promotion_id?._errors[0]!,
          image: errors?.image?._errors[0]!
        });
        setLoading(false);
        return;
      }

      if (discountType == "percent") {
        if (parseInt(discount) > 100) {
          setFormError({
            ...formError,
            discount: "Discount percent must be between 0-100"
          })
          setLoading(false);
          return;
        }
      }else {
        if (parseInt(discount) < 100){
          setFormError({
            ...formError,
            discount: "Discount rupiah must be more than 100"
          })
          setLoading(false);
          return;
        }
        if (parseInt(discount) > parseInt(productPrice)) {
          setFormError({
            ...formError,
            discount: "Discount rupiah must be less than product price"
          })
          setLoading(false);
          return;
        }
      }

      if (!image) {
        setFormError({
          ...formError,
          image: "Image is required"
        })
        setLoading(false);
        return;
      }

      const token = session?.user?.token as string
      const resp = await uploadAPI.upload(token, {file: image as File})

      newPromotionItem.image = resp.data.filename.split("/").pop() as string

      const promotionItem = await promotionItemAPI.createPromotionItem(token, newPromotionItem)
      console.log(promotionItem)
      props.setPromotionItems((prev: any) => {
        if (prev) {
          return [...prev, {
            ...promotionItem,
            promotion_id: props.promotionId
          }]
        }else {
          return [promotionItem]
        }
      })
      
      setProductName("")
      setProductPrice("")
      setDiscount("")
      setImage(undefined)
      cleanErrorForm()
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
          <ErrorText>{formError.product_name}</ErrorText>
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
            Discount Type
          </label>
          <select
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percent">Persen</option>
            <option value="rupiah">Rupiah</option>
          </select>
        </div>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            {
              discountType === "percent" ? "Discount Percent (0-100)" : "Discount Rupiah (Rp)"
            }
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