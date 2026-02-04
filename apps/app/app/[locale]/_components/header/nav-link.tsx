import Link from "next/link";

export const NavLink = ({
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
