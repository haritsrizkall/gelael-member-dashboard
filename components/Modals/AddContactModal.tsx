"use client"
import { Dispatch, useState, SetStateAction } from "react";
import Modal, { ModalProps } from "./Modal";
import { MdContactPhone } from "react-icons/md";
import Button from "../Button";
import { Appconf } from "@/types/appconf";
import appconfAPI from "@/api/appconf";
import { useSession } from "next-auth/react";
import { z } from "zod";
import ErrorText from "../ErrorText";

interface AddContactModal extends ModalProps {
  onAdd: () => Promise<void>;
  contact: Appconf;
  setContact: Dispatch<SetStateAction<Appconf>>;
}

const AddContactModal = (props: AddContactModal) => {
  const [contactValue, setContactValue] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactType, setContactType] = useState("email");
  const [loading, setLoading] = useState(false);
  const [errorForm, setErrorForm] = useState({
    contactValue: "",
    contactName: ""
  });
  const cleanErrorForm = () => {
    setErrorForm({
      contactValue: "",
      contactName: ""
    });
  }
  const { data: session } = useSession();

  const createContactSchema = z.object({
    contactValue: z.string().min(1),
    contactName: z.string().min(1),
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      cleanErrorForm();
  
      const input = {
        contactValue,
        contactName
      };

      const result = createContactSchema.safeParse(input);
      if (!result.success) {
        const errors = result.error.format();
        setErrorForm({
          contactValue: errors?.contactValue?._errors[0]!,
          contactName: errors?.contactName?._errors[0]!
        });
        setLoading(false);
        return;
      }
  
      if (contactType == 'email') {
        let newAppconf = props.contact;
        newAppconf.contacts.emails.push({
          value: contactValue,
          name: contactName
        });
        props.setContact(newAppconf);
      }else {
        let newAppconf = props.contact;
        newAppconf.contacts.phones.push({
          value: contactValue,
          name: contactName
        });
        props.setContact(newAppconf);
      }
      await props.onAdd();
  
      setContactValue("");
      setContactName("");
      setContactType("email");
      cleanErrorForm();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Modal {...props}>
      <>
      <div className="">
        <h1 className="text-center text-xl font-medium mb-10">Add Contact</h1>
        <div className="mb-4.5">
          <label className="mb-3 block text-black dark:text-white">
            Contact Type
          </label>
          <div className="relative z-20 bg-white dark:bg-form-input">
          <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" value={contactType} onChange={(e) => setContactType(e.target.value)}>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill="#637381"
                ></path>
              </g>
            </svg>
          </span>
          </div>
        </div>
        <div className="mb-4 5">
          <label className="mb-3 block text-black dark:text-white">
            Name
          </label>
          <input
            required
            onChange={(e) => setContactName(e.target.value)}
            value={contactName}
            type="text"
            placeholder="Customer Service"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <ErrorText>{errorForm.contactName}</ErrorText>
        </div>
        <div className="mb-4 5">
          <label className="mb-3 block text-black dark:text-white">
            Value
          </label>
          <input
            required
            onChange={(e) => setContactValue(e.target.value)}
            value={contactValue}
            type="text"
            placeholder="0812231231 / gelael@gmail.com"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <ErrorText>{errorForm.contactValue}</ErrorText>
        </div>
      </div>
      <div>
        <Button
          text="Add Contact"
          onClick={handleSubmit}
          isLoading={loading}
        />
      </div>
      </>
    </Modal>
  )
}

export default AddContactModal;