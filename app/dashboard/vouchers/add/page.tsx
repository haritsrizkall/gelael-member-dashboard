"use client"
import { useState } from "react";

const AddVoucher = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [expired_at, setExpiredAt] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);

  return (
    <></>
  )
}

export default AddVoucher