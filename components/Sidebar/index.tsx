import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAddressBook, FaImage, FaInstagram, FaSignOutAlt, FaStore } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { MdDiscount } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { IoFastFood, IoSettings } from "react-icons/io5";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/dashboard/">
          <h1 className="font-bold text-white text-2xl">Gelael Member</h1>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Promotion --> */}
              <li>
                <Link
                  href="/dashboard/promotions"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("promotions") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <CiDiscount1 className="fill-current" />
                  Promotion (Crazy Deal)
                </Link>
              </li>
              {/* <!-- Menu Item Promotion --> */}
              {/* <!-- Menu Item Voucher --> */}
              <li>
                <Link
                  href="/dashboard/vouchers"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("vouchers") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                 <MdDiscount className="fill-current" /> 
                  Voucher
                </Link>
              </li>
              {/* <!-- Menu Item Voucher --> */}

              {/* <!-- Menu Item Banner --> */}
              <li>
                <Link
                  href="/dashboard/banners"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("banners") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                 <FaImage className="fill-current" /> 
                  Banner
                </Link>
              </li>
              {/* <!-- Menu Item Banner --> */}

              {/* <!-- Menu Item Member --> */}
              <li>
                <Link
                  href="/dashboard/members"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("members") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <FaUsers className="fill-current" />
                  Member
                </Link>
              </li>
              {/* <!-- Menu Item Member --> */}
              {/* <!-- Menu Item User --> */}
              <li>
                <Link
                  href="/dashboard/users"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("users") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <FaUsers className="fill-current" />
                  User
                </Link>
              </li>
              {/* <!-- Menu Item User --> */}

              {/* <!-- Menu Item Recipe --> */}
              <li>
                <Link
                  href="/dashboard/recipes"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("recipes") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <IoFastFood className="fill-current" />
                  Recipe
                </Link>
              </li>
              {/* <!-- Menu Item Recipe --> */}
              
               {/* <!-- Menu Item Store --> */}
               <li>
                <Link
                  href="/dashboard/stores"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("stores") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <FaStore className="fill-current" />
                  Store
                </Link>
              </li>
              {/* <!-- Menu Item Store --> */}

              {/* <!-- Menu Item Notifications --> */}
              <li>
                <Link
                  href="/dashboard/notifications"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("notifications") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <IoIosNotifications className="fill-current" />
                  Notifications
                </Link>
              </li>
              {/* <!-- Menu Item Notification --> */}

              {/* <!-- Menu Item Social Media --> */}
              <li>
                <Link
                  href="/dashboard/configurations"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("configurations") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <IoSettings className="fill-current"/>
                  Configuration
                </Link>
              </li>
              {/* <!-- Menu Item Notification --> */}

              {/* <!-- Menu Item Chart --> */}
              <li>
                <div
                  onClick={() => signOut()}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark cursor-pointer dark:hover:bg-meta-4 ${
                    pathname.includes("chart") && "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <FaSignOutAlt className="fill-current" />
                  Sign Out
                </div>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
