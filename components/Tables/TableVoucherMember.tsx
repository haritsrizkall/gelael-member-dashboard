import { Meta } from "@/types/meta";
import { VoucherMemberWithNameAndEmail } from "@/types/voucherMember";



interface TableVoucherMemberProps {
  voucherMembers: VoucherMemberWithNameAndEmail[]
  meta?: Meta
}

const columns = [
  {
    "title": "No",
    "width": "50px"
  },
  {
    "title": "Email",
    "width": "50px"
  },
  {
    "title": "Name",
    "width": "50px"
  },
  {
    "title": "Voucher code",
    "width": "50px"
  },
  {
    "title": "Used",
    "width": "50px"
  },
  {
    "title": "Used At",
    "width": "50px"
  },
  {
    "title": "used At Store",
    "width": "50px"
  }
]

const TableVoucherMember = ({voucherMembers, meta}: TableVoucherMemberProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {columns.map((column, key) => (
              <th key={key} className={`min-w-[${column.width}] py-4 px-4 font-medium text-black dark:text-white`}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          { voucherMembers && voucherMembers.map((voucher: VoucherMemberWithNameAndEmail, key) => (
            <tr key={key}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
              <p className="text-black dark:text-white">
                {key + 1}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.email ?? "-"}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.name ?? "-"}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.voucher_code}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.used ? "True" : "False"}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.used_at ? voucher.used_at : "-"}
              </p>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">
                {voucher.used_at_store ? voucher.used_at_store : "-"}
              </p>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default TableVoucherMember