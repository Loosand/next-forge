"use client";

import { LogoIcon } from "@repo/design-system/components/icons/logo-icon";
import { Button } from "@repo/design-system/components/ui/button";
import { LanguageSwitcher } from "@repo/internationalization/ui/language-switcher";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Explore", href: "/" },
  { label: "Image", href: "/image" },
  { label: "Video", href: "/video" },
  { label: "Edit", href: "/edit" },
  { label: "Character", href: "/character" },
  { label: "Inpaint", href: "/inpaint" },
  { label: "Vibe Motion", href: "/vibe-motion", badge: "Beta" },
  { label: "Cinema Studio", href: "/cinema-studio" },
  { label: "Motion Control", href: "/motion-control" },
  { label: "AI Influencer", href: "/ai-influencer" },
  { label: "Apps", href: "/apps" },
  { label: "Community", href: "/community" },
];

const NavLink = ({
  href,
  label,
  badge,
  isActive,
}: {
  href: string;
  label: string;
  badge?: string;
  isActive: boolean;
}) => (
  <Link
    className="grid grid-flow-col items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-1 font-medium text-muted-foreground text-sm transition hover:text-primary active:opacity-60 data-[active=true]:text-foreground"
    data-active={isActive}
    href={href}
  >
    {label}
    {badge && (
      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary text-xs">
        {badge}
      </span>
    )}
  </Link>
);

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 left-0 z-40 w-full bg-background backdrop-blur-md dark:bg-black">
      <div className="container relative mx-auto flex h-(--header-height) items-center gap-4 px-4 md:px-0">
        {/* Left: Logo */}
        <Link href="/">
          <LogoIcon />
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden flex-1 items-center gap-0.5 overflow-x-auto xl:flex">
          {navItems.map((item) => (
            <NavLink
              badge={item.badge}
              href={item.href}
              isActive={pathname.startsWith(item.href)}
              key={item.href}
              label={item.label}
            />
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />

          <Button render={<Link href="/pricing" />} variant="link">
            Pricing
          </Button>

          <Button
            className="hidden sm:inline-flex"
            render={<Link href="/auth/sign-in" />}
            variant="secondary"
          >
            Login
          </Button>

          <Button render={<Link href="/auth/sign-up" />}>Sign up</Button>
        </div>
      </div>
    </header>
  );
};
