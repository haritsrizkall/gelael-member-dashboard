"use client"

import memberAPI from "@/api/member";
import uploadAPI from "@/api/upload";
import voucherAPI, { InputSetVoucherMembers } from "@/api/voucher";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import ErrorText from "@/components/ErrorText";
import CreateVoucherMemberModal from "@/components/Modals/CreateVoucherMemberModal";
import TableVoucherMember from "@/components/Tables/TableVoucherMember";
import { Voucher, VoucherStats, defaultVoucher, defaultVoucherStats } from "@/types/voucher";
import { VoucherMemberWithNameAndEmail } from "@/types/voucherMember";
import { cn, statusString } from "@/utils/utils";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const Members = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [voucher, setVoucher] = useState<Voucher>(defaultVoucher());
  const [voucherStats, setVoucherStats] = useState<VoucherStats>(defaultVoucherStats());
  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [voucherMembers, setVoucherMembers] = useState<VoucherMemberWithNameAndEmail[]>([]);
  const [giveMode, setGiveMode] = useState<boolean>(false);
  const [formError, setFormError] = useState({
    title: "",
    description: "",
    image: "",
    expiredAt: "",
    startAt: ""
  });

  const cleanErrorForm = () => {
    setFormError({
      title: "",
      description: "",
      image: "",
      expiredAt: "",
      startAt: ""
    });
  }

  const { data: session } = useSession();
  const params = useParams();

  const getVoucherDetail = async () => {
    try {
      const token = session?.user?.token as string;
      const resp = await voucherAPI.getDetail(token, parseInt(params.id as string));
      console.log("resp", resp);
      setVoucher({
        ...resp.voucher_data,
        expired_at: moment(resp.voucher_data.expired_at).format("YYYY-MM-DD"),
        start_at: moment(resp.voucher_data.start_at).format("YYYY-MM-DD")
      });
      setVoucherStats(resp.stats);
    } catch (error) {
      console.log("error", error);
    }
  }

  const getVoucherMember = async () => {
    try {
      const token = session?.user?.token as string;
      const resp = await voucherAPI.getVoucherMemberByVoucherId(token, parseInt(params.id as string));
      console.log("resp", resp);
      setVoucherMembers(resp.data);
    } catch (error) {
      console.log("error", error);
    }
  }

  const editVoucherSchema = z.object({
    id: z.number(),
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string(),
    expired_at: z.coerce.date().refine((date) => {
      const today = moment().startOf("day").toDate();
      return date >= today;
    }, {
      message: "Expired date must be greater or equal than today"
    }),
    start_at: z.coerce.date().refine((date) => {
      const today = moment().startOf("day").toDate();
      return date >= today;
    }, {
      message: "Start date must be greater or equal than today"
    })
  });

  const handleEdit = async () => {
    try {
      setLoading(true);
      cleanErrorForm();
      const token = session?.user?.token as string;
      const input = {
        id: voucher.id,
        title: voucher.title,
        description: voucher.description,
        image: voucher.image.split("/").pop() as string,
        expired_at: new Date(voucher.expired_at),
        start_at: new Date(voucher.start_at),
      }

      const result = editVoucherSchema.safeParse(input);
      if (!result.success) {
        const errors = result.error.format();
        console.log("Errors ", errors);
        setFormError({
          title: errors?.title?._errors[0]!,
          description: errors?.description?._errors[0]!,
          image: errors?.image?._errors[0]!,
          expiredAt: errors?.expired_at?._errors[0]!,
          startAt: errors?.start_at?._errors[0]!
        });
        setLoading(false);
        return;
      }

      if (image == undefined) {
        const resp = await voucherAPI.updateVoucher(token, input);
      }else {
        const respImage = await uploadAPI.upload(token, { file: image as File });
        input.image = respImage.data.filename.split("/").pop() as string;
        const resp = await voucherAPI.updateVoucher(token, input);
        setVoucher({...voucher, image: respImage.data.filename});
        setImage(undefined);
      }
      setEditMode(false);
      cleanErrorForm();
      alert("Voucher updated successfully");
    } catch (error) {
      console.log("error", error);
      alert("Failed to update voucher");
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getVoucherDetail();
    getVoucherMember();
  }, [params.id])

  return (
    <>
      <CreateVoucherMemberModal isOpen={giveMode} onClose={() => setGiveMode(false)} voucherID={parseInt(params.id as string)}/>
      <Breadcrumb
        pageName="Voucher Detail"
        parent={{ name: "Vouchers - POS", link: "/dashboard/voucherpos" }}
      />
      <div className="flex flex-col gap-9 mb-10">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Total Voucher
              </h3>
            </div>
            <div className="py-4 px-6.5">
              <p>{voucherStats.total_vouchers}</p>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Unused Vouchers 
              </h3>
            </div>
            <div className="py-4 px-6.5">
              <p>{voucherStats.total_unused_vouchers}</p>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Used vouchers
              </h3>
            </div>
            <div className="py-4 px-6.5">
              <p>{voucherStats.total_used_vouchers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
            <h3 className="font-medium text-black dark:text-white mr-3">
              Voucher Detail
            </h3>
            {/* status badge */}
            <div className="flex items-center gap-2.5">
              <div className={cn("bg-primary py-1 px-4 rounded-full", statusString(voucher.start_at, voucher.expired_at) == "Expired" ? "bg-danger" : statusString(voucher.start_at, voucher.expired_at) == "Upcoming" ? "bg-warning" : "bg-success"  )}>
                <span className="text-white font-medium text-sm">{statusString(voucher.start_at, voucher.expired_at)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="p-6.5 flex">
              <div className="mr-10 flex-none">
                <Image
                  src={voucher?.image}
                  loader={() => voucher.image}
                  alt="voucher"
                  width={300}
                  height={300}
                />
              </div>
              <div className="flex-1 grow">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    required
                    disabled={!editMode}
                    type="text"
                    value={voucher?.title}
                    onChange={(e) => setVoucher({...voucher, title: e.target.value})}
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
                      disabled={!editMode}
                      onChange={(e) => setVoucher({...voucher, description: e.target.value})}
                      value={voucher?.description}
                      type="text"
                      placeholder="description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorText>{formError.description}</ErrorText>
                </div>


                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image (Kosongkan jika tidak ingin update image)
                  </label>
                  <input
                    disabled={!editMode}
                    required
                    onChange={(e) => setImage(e.target.files?.[0])}
                    type="file"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />  
                  <ErrorText>{formError.image}</ErrorText>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Type
                  </label>
                    <input
                      required
                      type="text"
                      placeholder="text"
                      value={voucher?.type}
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amount
                  </label>
                    <input
                      required
                      disabled
                      value={voucher?.amount}
                      type="currency"
                      placeholder="amount"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Start at
                  </label>
                  <div className="relative">
                    <input
                      required
                      disabled={!editMode}
                      onChange={(e) => setVoucher({...voucher, start_at: e.target.value})}
                      value={voucher?.start_at}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorText>{formError.startAt}</ErrorText>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Expired at
                  </label>
                  <div className="relative">
                    <input
                      required
                      disabled={!editMode}
                      onChange={(e) => setVoucher({...voucher, expired_at: e.target.value})}
                      value={voucher?.expired_at}
                      type="date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorText>{formError.expiredAt}</ErrorText>
                  </div>
                </div>
              </div>
            </div> 
          </div>
          <div>
            <div className="p-6.5 flex justify-end">
              {
                !editMode ? (
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark"
                  >
                    <span>Edit</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-2.5 bg-gray py-3 px-6.5 rounded font-bold text-graydark transition hover:bg-primary-dark mr-4.5"
                    >
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleEdit}
                      className={cn("flex items-center gap-2.5 bg-primary py-3 px-6.5 rounded font-bold text-white transition hover:bg-primary-dark", loading ? "bg-gray text-primary" : "")}
                    >
                      <span>{loading ? "Loading..." : "Save"}</span>
                    </button>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>

      {
        voucher.type == "MEMBER" && (
          <>
          <h2 className="text-title-md3 font-semibold text-black dark:text-white mb-5">Voucher</h2>
          <button
            className="flex justify-center rounded bg-primary py-3 px-5 mb-5 font-medium text-gray"
            onClick={() => setGiveMode(true)}
          >
              Give Voucher
          </button>
          </>
        )
      }
      <div className="mt-4">
        <TableVoucherMember voucherMembers={voucherMembers} />
      </div>
    </>
  )
}

export default Members