import { cn } from "@repo/design-system/lib/utils";

export const ProfileIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={cn("size-5 shrink-0", className)}
    height="20"
    viewBox="0 0 20 20"
    width="20"
  >
    <path
      clipRule="evenodd"
      d="M10 5C11.956 5 13.5417 6.58566 13.5417 8.54167C13.5417 10.4977 11.956 12.0833 10 12.0833C8.04399 12.0833 6.45833 10.4977 6.45833 8.54167C6.45833 6.58566 8.04399 5 10 5Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M10 0.833333C15.0626 0.833333 19.1667 4.9374 19.1667 10C19.1667 15.0626 15.0626 19.1667 10 19.1667C4.9374 19.1667 0.833333 15.0626 0.833333 10C0.833333 4.9374 4.9374 0.833333 10 0.833333ZM10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 11.9194 3.22149 13.6702 4.40755 14.9967C5.98935 13.9477 7.92074 13.3333 10 13.3333C12.079 13.3333 14.0099 13.9479 15.5916 14.9967C16.7779 13.6701 17.5 11.9196 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);
