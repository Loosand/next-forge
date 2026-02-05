import { EmptyState, GenerationForm } from "./_components";

export default function ImagePage() {
  return (
    <div className="flex h-(--screen-height-minus-header-mobile-menu) flex-col md:h-(--screen-height-minus-header)">
      <EmptyState />
      <GenerationForm />
    </div>
  );
}
