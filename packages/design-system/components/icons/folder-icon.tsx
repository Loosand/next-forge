import { cn } from "@repo/design-system/lib/utils";

export const FolderIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={cn("size-5 shrink-0", className)}
    height="20"
    viewBox="0 0 20 20"
    width="20"
  >
    <path
      d="M4.65788 2.5C3.39223 2.5 2.36621 3.52602 2.36621 4.79167V14.375C2.36621 15.6407 3.39223 16.6667 4.65788 16.6667H16.7412C18.0069 16.6667 19.0329 15.6407 19.0329 14.375V7.29167C19.0329 6.02602 18.0069 5 16.7412 5H11.5915C11.2432 5 10.918 4.82593 10.7248 4.53615L10.0477 3.52047C9.62263 2.88294 8.90713 2.5 8.1409 2.5H4.65788Z"
      fill="currentColor"
    />
  </svg>
);
