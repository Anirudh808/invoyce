"use client";

import { cn } from "@/lib/utils";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useContext, createContext, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GetUserWithBusiness } from "@/lib/types";

const SidebarContext = createContext({ expanded: true });

export default function Sidebar({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState<GetUserWithBusiness>();

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
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Image src="/logo.svg" className={``} alt="" width={44} height={44} />
          <p
            className={cn(
              "text-3xl tracking-wider text-indigo-800 -ml-12 font-bold",
              expanded ? "w-32" : "w-0 hidden"
            )}
          >
            Invoyce
          </p>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-indigo-800 mt-[6px]"
          >
            {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 mt-6">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          {/* <Image src="JD" alt="" className="w-10 h-10 rounded-md" /> */}

          <Link href="/console/user" className="flex ">
            {userData && userData.usersBusiness ? (
              <Image
                src={userData?.usersBusiness.profilePic as string}
                alt="user profile"
                width={50}
                height={50}
                className="rounded-md"
              />
            ) : (
              <p className="px-5 py-4 bg-indigo-300 text-indigo-800 text-xl text-center rounded-xl">
                JD
              </p>
            )}
          </Link>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
              `}
          >
            <Link href={"/console/user"}>
              <div className="leading-4">
                <h4 className="font-semibold">{session?.user?.name}</h4>
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
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  href: string;
}) {
  const { expanded } = useContext(SidebarContext);
  const pathName = usePathname();
  active = pathName === href;

  return (
    <Link
      href={href}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </Link>
  );
}
