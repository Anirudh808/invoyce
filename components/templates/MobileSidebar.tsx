"use client";

import {
  LayoutDashboardIcon,
  LogOut,
  Menu,
  NotebookTabs,
  User2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarItem } from "../Sidebar";
import { Session } from "next-auth";
import { GetUserWithBusiness } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

const MobileSidebarIndex = ({ session }: { session: Session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<GetUserWithBusiness>();
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/users");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
        }
      }
    }
    getData();
  }, []);

  return (
    <div className="sm:hidden relative">
      {/* Toggle button */}
      <div className="flex justify-end p-3 z-20 relative">
        <button onClick={() => setIsOpen((prev) => !prev)}>
          {!isOpen ? <Menu className="w-8 h-8" /> : <X className="w-8 h-8" />}
        </button>
      </div>

      {/* Sidebar overlay and sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <aside>
          <div className="w-full flex flex-col items-center gap-6 mt-12 text-2xl">
            <div>
              <SidebarItem
                icon={<LayoutDashboardIcon size={30} />}
                text="Dashboard"
                href="/console/dashboard"
                onClick={() => setIsOpen(false)}
              />
              <SidebarItem
                icon={<User2 size={30} />}
                text="Clients"
                href="/console/clients"
                onClick={() => setIsOpen(false)}
              />
              <SidebarItem
                icon={<NotebookTabs size={30} />}
                text="Invoices"
                href="/console/invoices"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="w-4/5 h-[2px] bg-gray-400"></div>
            <div className=" w-full px-4">
              {userData && userData.usersBusiness && session && (
                <div className="flex justify-between items-center">
                  <Link href="/console/user" className="flex gap-1 items-start">
                    <Image
                      src={userData.usersBusiness.profilePic as string}
                      alt="user profile"
                      width={50}
                      height={50}
                      className="rounded-md w-10 h-10"
                    />
                    <div className="leading-4">
                      <h4 className="font-semibold text-sm max-w-32">
                        {session?.user?.name}
                      </h4>
                      <span className="text-xs text-gray-600">
                        {session?.user?.email}
                      </span>
                    </div>
                  </Link>
                  <Button
                    onClick={() => signOut()}
                    variant={"ghost"}
                    className="ml-2 cursor-pointer"
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Optional overlay to dim background */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-30 z-0"
        ></div>
      )}
    </div>
  );
};

// const Sidebar = ({
//   setIsOpen,
//   userData,
//   session,
// }: {
//   setIsOpen: (val: boolean) => void;
//   userData: GetUserWithBusiness;
//   session: Session;
// }) => {
//   return (
//     <aside>
//       <div className="w-full flex flex-col items-center mt-12 text-2xl">
//         <div>
//           <SidebarItem
//             icon={<LayoutDashboardIcon size={30} />}
//             text="Dashboard"
//             href="/console/dashboard"
//             onClick={() => setIsOpen(false)}
//           />
//           <SidebarItem
//             icon={<User2 size={30} />}
//             text="Clients"
//             href="/console/clients"
//             onClick={() => setIsOpen(false)}
//           />
//           <SidebarItem
//             icon={<NotebookTabs size={30} />}
//             text="Invoices"
//             href="/console/invoices"
//             onClick={() => setIsOpen(false)}
//           />
//         </div>
//         <div>
//           <Link href="/console/user" className="flex ">
//             {userData !== undefined && userData.usersBusiness ? (
//               <Image
//                 src={userData.usersBusiness.profilePic as string}
//                 alt="user profile"
//                 width={50}
//                 height={50}
//                 className="rounded-md"
//               />
//             ) : (
//               <p className="px-5 py-4 bg-indigo-300 text-indigo-800 text-xl text-center rounded-xl">
//                 JD
//               </p>
//             )}
//           </Link>
//           <div
//             className={`
//               flex justify-between items-center
//               overflow-hidden transition-all w-52 ml-3`}
//           >
//             <Link href={"/console/user"}>
//               <div className="leading-4">
//                 <h4 className="font-semibold">{session?.user?.name}</h4>
//                 <span className="text-xs text-gray-600">
//                   {session?.user?.email}
//                 </span>
//               </div>
//             </Link>
//             <Button
//               onClick={() => signOut()}
//               variant={"ghost"}
//               className="ml-2 cursor-pointer"
//             >
//               <LogOut size={20} />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

export default MobileSidebarIndex;
