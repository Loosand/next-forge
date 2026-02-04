"use client";

import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { env } from "@/env";
import { LanguageSwitcher } from "./language-switcher";

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background">
      <div className="container relative mx-auto flex h-(--header-height) flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex" />
        <div className="flex items-center gap-2 lg:justify-center">
          <svg
            className="-translate-y-[0.5px] h-[18px] w-[18px] fill-current"
            fill="none"
            height="22"
            viewBox="0 0 235 203"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Vercel</title>
            <path
              d="M117.082 0L234.164 202.794H0L117.082 0Z"
              fill="currentColor"
            />
          </svg>
          <p className="whitespace-nowrap font-semibold">next-forge</p>
        </div>
        <div className="flex w-full justify-end gap-4">
          <div className="hidden md:inline">
            <LanguageSwitcher />
          </div>
          <div className="hidden md:inline">
            <ModeToggle />
          </div>
          <Button className="hidden md:inline" variant="outline">
            <Link href={`${env.NEXT_PUBLIC_APP_URL}/auth/sign-in`}>
              {dictionary.web.header.signIn}
            </Link>
          </Button>
          <Button>
            <Link href={`${env.NEXT_PUBLIC_APP_URL}/auth/sign-up`}>
              {dictionary.web.header.signUp}
            </Link>
          </Button>
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button onClick={() => setOpen(!isOpen)} variant="ghost">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
