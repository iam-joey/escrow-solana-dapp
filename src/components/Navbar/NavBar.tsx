"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { NavBarData } from "./data";
import { ThemeToggleButton } from "../ToggleButtonTheme";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

export const WalletMultiButtonFix = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => <div className=" p-5 w-20 rounded-lg">Loading...</div>,
  }
);

const DeskTopNavBar: React.FC = () => {
  const path = usePathname();
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className="p-3 justify-between items-center hidden md:flex">
      <div className="flex justify-between cursor-pointer font-semibold p-2 w-[30%]">
        {NavBarData.map((item) => (
          <div
            onClick={() => {
              router.push(`${item.route}`);
            }}
            className={`${
              theme === "light"
                ? `${
                    path === item.route
                      ? "text-slate-900 border-b border-black pb-2"
                      : "text-zinc-500"
                  }`
                : `${
                    path === item.route
                      ? "border-b border-blue-600 pb-2 text-slate-300"
                      : "text-slate-500"
                  }`
            }  p-3 items-center `}
            key={item.route}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="flex gap-4  p-2 items-center">
        <ThemeToggleButton />
        <WalletMultiButtonFix />
      </div>
    </div>
  );
};

export default DeskTopNavBar;
