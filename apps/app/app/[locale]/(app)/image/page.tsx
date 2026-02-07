import { ImageGenerator } from "./_components";
import { getGenerationHistory } from "./actions";

export default async function ImagePage() {
  const history = await getGenerationHistory();

  return (
    <div className="flex h-(--screen-height-minus-header-mobile-menu) flex-col md:h-(--screen-height-minus-header)">
      <ImageGenerator history={history} />
    </div>
  );
}
