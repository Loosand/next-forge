"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "../client";

type UserMenuProps = {
  showName?: boolean;
};

export const UserMenu = ({ showName }: UserMenuProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
        {session.user.name?.charAt(0).toUpperCase() || "U"}
      </div>
      {showName && (
        <div className="flex flex-col truncate">
          <span className="truncate font-medium text-sm">
            {session.user.name}
          </span>
          <span className="truncate text-muted-foreground text-xs">
            {session.user.email}
          </span>
        </div>
      )}
      <button
        className="ml-auto text-muted-foreground text-xs hover:text-foreground"
        onClick={handleSignOut}
        type="button"
      >
        Sign out
      </button>
    </div>
  );
};
