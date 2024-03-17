"use client"
import appconfAPI from "@/api/appconf";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ErrorText from "@/components/ErrorText";
import AddContactModal from "@/components/Modals/AddContactModal";
import DeleteConfirmationModal from "@/components/Modals/DeleteConfirmationModal";
import { Appconf } from "@/types/appconf";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { z } from "zod";

const SocialMedia = () => {
  const [editCommon, setEditCommon] = useState(false)
  const [editContacts, setEditContacts] = useState(false)
  const [editSocmed, setEditSocmed] = useState(false)
  const [addContacts, setAddContacts] = useState(false)
  const [loadingCommon, setLoadingCommon] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingSocmed, setLoadingSocmed] = useState(false)
  const [appconf, setAppconf] = useState<Appconf>({
    slider_interval: 0,
    instagram: "",
    tiktok: "",
    contacts: {
      emails: [],
      phones: []
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
        emails: appconf.contacts.emails,
        phones
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
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Contacts
            </h3>
          </div>
          <div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phones 
                </label>
                {
                  appconf.contacts.phones.map((phone, index) => (
                    <div className="flex items-center mb-3" key={index}>
                    <input
                      key={index}
                      required
                      disabled={!editContacts}
                      value={phone}
                      onChange={(e) => {
                        const newPhones = appconf.contacts.phones
                        newPhones[index] = e.target.value
                        setAppconf({...appconf, contacts: {...appconf.contacts, phones: newPhones}})
                      }}
                      type="text"
                      placeholder="08123456789"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary mr-3"
                    />
                    <MdDelete className="fill-current text-lg text-danger cursor-pointer" onClick={() => handleDeletePhone(index)}/>
                    </div>
                  ))
                }
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Emails 
                </label>
                {
                  appconf.contacts.emails.map((email, index) => (
                    <div className="flex items-center mb-3" key={index}>
                    <input
                      key={index}
                      required
                      disabled={!editContacts}
                      value={email}
                      onChange={(e) => {
                        const newEmails = appconf.contacts.emails
                        newEmails[index] = e.target.value
                        setAppconf({...appconf, contacts: {...appconf.contacts, emails: newEmails}})
                      }}
                      type="text"
                      placeholder="08123456789"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary mr-3"
                    />
                    <MdDelete className="fill-current text-lg text-danger cursor-pointer" onClick={() => handleDeleteEmail(index)}/>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
            
          <div className="p-6.5 flex justify-end">
            {
              !editContacts ? (
                <>
                <button
                  onClick={() => setAddContacts(!addContacts)}
                  className="flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark mr-4.5"
                >
                  <span>Add</span>
                </button>
                <button
                  onClick={() => setEditContacts(!addContacts)}
                  className="flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark"
                >
                  <span>Edit</span>
                </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditContacts(!editContacts)}
                    className="flex items-center gap-2.5 bg-gray py-3 px-6.5 rounded font-bold text-graydark transition hover:bg-primary-dark mr-4.5"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleEditContacts}
                    className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loadingContacts ? "bg-gray text-primary" : "")}
                  >
                    <span>{loadingContacts ? "Loading..." : "Save"}</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>
      
        
    </>
  );
}

export default SocialMedia;
