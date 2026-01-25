import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { PhoneCall } from "lucide-react";
import Link from "next/link";

type FAQProps = {
  dictionary: Dictionary;
};

export const FAQ = ({ dictionary }: FAQProps) => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                {dictionary.web.home.faq.title}
              </h4>
              <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
                {dictionary.web.home.faq.description}
              </p>
            </div>
            <div className="">
              <Link href="/contact">
                <Button className="gap-4" variant="outline">
                  {dictionary.web.home.faq.cta}{" "}
                  <PhoneCall className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Accordion className="w-full">
          {dictionary.web.home.faq.items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: "Static index key is safe"
            <AccordionItem key={index} value={`index-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
);
