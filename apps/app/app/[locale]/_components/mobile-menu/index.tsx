"use client";

import { CommunityIcon } from "@repo/design-system/components/icons/community-icon";
import { CreateIcon } from "@repo/design-system/components/icons/create-icon";
import { FolderIcon } from "@repo/design-system/components/icons/folder-icon";
import { HomeIcon } from "@repo/design-system/components/icons/home-icon";
import { ProfileIcon } from "@repo/design-system/components/icons/profile-icon";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  activePatterns?: string[];
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon />,
  },
  {
    href: "/community",
    label: "Community",
    icon: <CommunityIcon />,
  },
  {
    href: "/library",
    label: "Library",
    icon: <FolderIcon />,
    activePatterns: ["/library", "/sora-trends"],
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <ProfileIcon />,
  },
];

const NavLink = ({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
}) => (
  <Link
    className={cn(
      "flex flex-col items-center justify-center gap-0.5 text-center transition active:translate-y-0.5 active:opacity-60",
      "[&>svg]:size-5 [&>svg]:shrink-0",
      isActive ? "text-foreground" : "text-muted-foreground"
    )}
    data-active={isActive}
    href={href}
  >
    {icon}
    <span className="font-medium text-[10px]">{label}</span>
  </Link>
);

const CreateButton = () => (
  <div className="grid items-center justify-center p-1">
    <Link
      className="grid h-11 w-[66px] items-center justify-center rounded-xl bg-primary shadow-[inset_0px_-0.25rem_rgba(0,0,0,0.25)] transition active:translate-y-0.5 active:opacity-60"
      href="/image"
    >
      <CreateIcon className="text-primary-foreground" />
    </Link>
  </div>
);

const isPathActive = (pathname: string, href: string, patterns?: string[]) => {
  if (href === "/") {
    return pathname === "/";
  }
  if (patterns) {
    return patterns.some((pattern) => pathname.startsWith(pattern));
  }
  return pathname.startsWith(href);
};

export const MobileMenu = () => {
  const pathname = usePathname();

  // Remove locale prefix for path matching (e.g., /en/profile -> /profile)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  return (
    <footer className="-bottom-px sticky z-50 grid h-(--mobile-menu-height) w-full auto-cols-fr grid-flow-col items-center border-separator border-t bg-background/90 px-1 backdrop-blur-sm md:hidden">
      {/* First two nav items */}
      {navItems.slice(0, 2).map((item) => (
        <NavLink
          href={item.href}
          icon={item.icon}
          isActive={isPathActive(
            pathWithoutLocale,
            item.href,
            item.activePatterns
          )}
          key={item.href}
          label={item.label}
        />
      ))}

      {/* Center create button */}
      <CreateButton />

      {/* Last two nav items */}
      {navItems.slice(2).map((item) => (
        <NavLink
          href={item.href}
          icon={item.icon}
          isActive={isPathActive(
            pathWithoutLocale,
            item.href,
            item.activePatterns
          )}
          key={item.href}
          label={item.label}
        />
      ))}
    </footer>
  );
};
