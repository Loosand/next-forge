import { EmptyState, GenerationForm } from "./_components";

export default function ImagePage() {
  return (
    <div className="flex h-(--screen-height-minus-header) flex-col">
      <EmptyState />
      <GenerationForm />
    </div>
  );
}
