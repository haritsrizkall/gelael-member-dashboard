"use client"
import appconfAPI from "@/api/appconf";
import uploadAPI from "@/api/upload";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ErrorText from "@/components/ErrorText";
import AddContactModal from "@/components/Modals/AddContactModal";
import DeleteConfirmationModal from "@/components/Modals/DeleteConfirmationModal";
import { Appconf, Contact } from "@/types/appconf";
import { cn, getApiUrl } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { z } from "zod";

const contactColumns = [
  {
    title: "No",
    width: "50px"
  },
  {
    title: "Name",
    width: "50px"
  },
  {
    title: "Value",
    width: "50px"
  },
  {
    title: "Action",
    width: "50px"
  }

]

const SocialMedia = () => {
  const [editCommon, setEditCommon] = useState(false)
  const [editPOSImage, setEditPOSImage] = useState(false)
  const [editContacts, setEditContacts] = useState(false)
  const [editSocmed, setEditSocmed] = useState(false)
  const [addContacts, setAddContacts] = useState(false)
  const [loadingCommon, setLoadingCommon] = useState(false)
  const [loadingPOSImage, setLoadingPOSImage] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingSocmed, setLoadingSocmed] = useState(false)
  const [posVoucherImage, setPosVoucherImage] = useState<File | undefined>(undefined)
  const [defaultPOSVoucherIMage, setDefaultPOSVoucherImage] = useState<string>(`${getApiUrl()}/images/voucher-default.png`)
  const [appconf, setAppconf] = useState<Appconf>({
    slider_interval: 0,
    instagram: "",
    tiktok: "",
    contacts: {
      emails: [
        {
          name: "",
          value: ""
        }
      ],
      phones: [
        {
          name: "",
          value: ""
        }
      ]
    },
    privacy_policy: "",
    terms_condition: "",
  })
  const [errorFormSocmed, setErrorFormSocmed] = useState({
    instagram: "",
    tiktok: ""
  })
  const cleanErrorFormSocmed = () => {
    setErrorFormSocmed({
      instagram: "",
      tiktok: ""
    })
  }

  const [errorCommon, setErrorCommon] = useState({
    slider_interval: ""
  })
  const cleanErrorCommon = () => {
    setErrorCommon({
      slider_interval: ""
    })
  }

  const { data: session } = useSession()
  
  const editSocmedSchema = z.object({
    instagram: z.string().min(1),
    tiktok: z.string().min(1)
  })

  const handleEditSocmed = async () => {
    try {
      cleanErrorFormSocmed()
      setLoadingSocmed(true)
      
      const result = editSocmedSchema.safeParse(appconf)
      if (!result.success) {
        const errors = result.error.format()
        setErrorFormSocmed({
          instagram: errors?.instagram?._errors[0]!,
          tiktok: errors?.tiktok?._errors[0]!
        })
        setLoadingSocmed(false)
        return
      }
      
      const token = session?.user?.token as string
      await appconfAPI.updateSocial(token, {
        instagram: appconf.instagram,
        tiktok: appconf.tiktok
      })
      setLoadingSocmed(false)
      setEditSocmed(false)
      cleanErrorFormSocmed()
      alert("Success to update social media")
    } catch (error) {
      console.log(error)
      setLoadingSocmed(false)
      alert("Error to update social media")
    }
  }

  const editCommonSchema = z.object({
    slider_interval: z.number().min(1)
  })

  const handleEditCommon = async () => {
    try {
      setLoadingCommon(true)
      cleanErrorCommon()

      const result = editCommonSchema.safeParse(appconf)
      if (!result.success) {
        const errors = result.error.format()
        setErrorCommon({
          slider_interval: errors?.slider_interval?._errors[0]!
        })
        setLoadingCommon(false)
        return
      }

      const token = session?.user?.token as string
      await appconfAPI.update(token, {
        slider_interval: appconf.slider_interval
      })
      setLoadingCommon(false)
      setEditCommon(false)
      cleanErrorCommon()
      alert("Success to update common configuration")
    } catch (error) {
      console.log(error)
      setLoadingCommon(false)
      alert("Error to update common configuration")
    }
  }

  const handleEditContacts = async () => {
    try {
      setLoadingContacts(true)
      const token = session?.user?.token as string
      await appconfAPI.updateContacts(token, {
        emails: appconf.contacts.emails,
        phones: appconf.contacts.phones
      })
      setLoadingContacts(false)
      setEditContacts(false)
      setAddContacts(false)
      alert("Success to update contacts")
    } catch (error) {
      console.log(error)
      setLoadingContacts(false)
      setAddContacts(false)
      alert("Error to update contacts")
    }
  }

  const handleDeletePhone = (index: number) => {
    try {
      const phones = appconf.contacts.phones
      phones.splice(index, 1)
      const token = session?.user?.token as string
      appconfAPI.updateContacts(token, {
        phones,
        emails: appconf.contacts.emails
      })
      setAppconf({...appconf, contacts: {...appconf.contacts, phones}})
      alert("Success to delete phone")
    }catch (error) {
      console.log(error)
      alert("Error to delete phone")
    }
  }

  const handleDeleteEmail = (index: number) => {
    try {
      const emails = appconf.contacts.emails
      emails.splice(index, 1)
      const token = session?.user?.token as string
      appconfAPI.updateContacts(token, {
        emails,
        phones: appconf.contacts.phones
      })
      setAppconf({...appconf, contacts: {...appconf.contacts, emails}})
      alert("Success to delete email")
    }catch (error) {
      console.log(error)
      alert("Error to delete email")
    }
  }

  const handleUploadPOSImage = async () => {
    try {
      setLoadingPOSImage(true)
      const token = session?.user?.token as string
      const resp = await uploadAPI.uploadWithName(token, {
        file: posVoucherImage as File,
        filename: "voucher-default"
      })
      setDefaultPOSVoucherImage(resp.data.filename)
      alert("Success to upload POS Voucher Image")
      location.reload()
    } catch (error) {
      alert("Error to upload POS Voucher Image")
    }finally {
      setLoadingPOSImage(false)
    }
  }

  const getData = async () => {
    try {
      const token = session?.user?.token as string
      const appconf = await appconfAPI.get(token)

      setAppconf(appconf)
      console.log(appconf)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  },[])


  return (
    <>
      <AddContactModal isOpen={addContacts} onClose={() => setAddContacts(false)} onAdd={handleEditContacts} setContact={setAppconf} contact={appconf} size="sm" />
      <Breadcrumb
        pageName="Configuration"
      />
      
      <div>
        <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Common Configuration</h2>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-10">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Common Configuration
            </h3>
          </div>
          <div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Slider interval
                </label>
                <input
                  required
                  disabled={!editCommon}
                  value={appconf?.slider_interval}
                  onChange={(e) => setAppconf({...appconf, slider_interval: parseInt(e.target.value)})}
                  type="number"
                  placeholder="4"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorText>{errorCommon.slider_interval}</ErrorText>
              </div>
            </div>
          </div>

          <div className="p-6.5 flex justify-end">
            {
              !editCommon ? (
                <button
                  onClick={() => setEditCommon(!editCommon)}
                  className="flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark"
                >
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditCommon(!editCommon)}
                    className="flex items-center gap-2.5 bg-gray py-3 px-6.5 rounded font-bold text-graydark transition hover:bg-primary-dark mr-4.5"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleEditCommon}
                    className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingCommon ? "bg-gray text-primary" : "")}
                  >
                    <span>{loadingCommon ? "Loading..." : "Save"}</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Voucher POS Image</h2>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-10">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Voucher POS Image
            </h3>
          </div>
          <div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <Image
                  src={defaultPOSVoucherIMage}
                  loader={() => defaultPOSVoucherIMage}
                  width={300}
                  height={300}
                  className="rounded-lg"
                  alt="POS Voucher Image"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Image (png, jpg, jpeg)
                </label>
                <input
                  required
                  disabled={!editPOSImage}
                  onChange={(e) => setPosVoucherImage(e.target.files?.[0])}
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/JPG, image/JPEG, image/PNG"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="p-6.5 flex justify-end">
            {
              !editPOSImage ? (
                <button
                  onClick={() => setEditPOSImage(!editPOSImage)}
                  className="flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark"
                >
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditPOSImage(!editPOSImage)}
                    className="flex items-center gap-2.5 bg-gray py-3 px-6.5 rounded font-bold text-graydark transition hover:bg-primary-dark mr-4.5"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUploadPOSImage}
                    className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingPOSImage ? "bg-gray text-primary" : "")}
                  >
                    <span>{loadingPOSImage ? "Loading..." : "Save"}</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Social Media</h2>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-10">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Social Media
            </h3>
          </div>
          <div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Instagram (username tanpa @)
                </label>
                <input
                  required
                  disabled={!editSocmed}
                  value={appconf?.instagram}
                  onChange={(e) => setAppconf({...appconf, instagram: e.target.value})}
                  type="text"
                  placeholder="instagram"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorText>{errorFormSocmed.instagram}</ErrorText>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Tiktok (username tanpa @)
                </label>
                <input
                  required
                  disabled={!editSocmed}
                  value={appconf?.tiktok}
                  onChange={(e) => setAppconf({...appconf, tiktok: e.target.value})}
                  type="text"
                  placeholder="tiktok"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <ErrorText>{errorFormSocmed.tiktok}</ErrorText>
              </div>
            </div>
          </div>

          <div className="p-6.5 flex justify-end">
            {
              !editSocmed ? (
                <button
                  onClick={() => setEditSocmed(!editSocmed)}
                  className="flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark"
                >
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditSocmed(!editSocmed)}
                    className="flex items-center gap-2.5 bg-gray py-3 px-6.5 rounded font-bold text-graydark transition hover:bg-primary-dark mr-4.5"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleEditSocmed}
                    className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingSocmed ? "bg-gray text-primary" : "")}
                  >
                    <span>{loadingSocmed ? "Loading..." : "Save"}</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Contacts</h2>
        <button
          onClick={() => setAddContacts(true)}
          className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray"
        >
          Add Contacts
        </button>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Emails
            </h3>
          </div>
          <div className="max-w-full overflow-x-auto p-5">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {contactColumns?.map((column, key) => (
              <th key={key} className={`min-w-[${column.width}] py-4 px-4 font-medium text-black dark:text-white`}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appconf?.contacts?.emails.map((email: Contact, key) => (
            <tr key={key}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">
                  {key + 1}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {email.name}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {email.value}  
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div className="flex items-center space-x-3.5">
                <button className="hover:text-primary" onClick={() => {
                  handleDeleteEmail(key)
                }}>
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                      fill=""
                    />
                    <path
                      d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                      fill=""
                    />
                    <path
                      d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                      fill=""
                    />
                    <path
                      d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                      fill=""
                    />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                  }}
                >
                </button>
              </div>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>

        {/* Phones */}
        
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Phones/Whatsapp
            </h3>
          </div>
          <div className="max-w-full overflow-x-auto p-5">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {contactColumns?.map((column, key) => (
              <th key={key} className={`min-w-[${column.width}] py-4 px-4 font-medium text-black dark:text-white`}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appconf?.contacts?.phones.map((phone: Contact, key) => (
            <tr key={key}>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">
                  {key + 1}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {phone.name}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {phone.value}  
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div className="flex items-center space-x-3.5">
                <button className="hover:text-primary" onClick={() => {
                  handleDeletePhone(key)
                }}>
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                      fill=""
                    />
                    <path
                      d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                      fill=""
                    />
                    <path
                      d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                      fill=""
                    />
                    <path
                      d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                      fill=""
                    />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                  }}
                >
                </button>
              </div>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
      
        
    </>
  );
}

export default SocialMedia;
