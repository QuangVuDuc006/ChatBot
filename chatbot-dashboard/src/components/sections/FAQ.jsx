import React from "react";
import { faqs } from "../../data/landingData";
import { FAQAccordion } from "../ui/FAQAccordion";
import { SectionHeader } from "../ui/SectionHeader";

export function FAQ() {
  return (
    <section id="faq" className="px-6 py-24 md:px-16 md:py-32">
      <SectionHeader label="FAQs" title="Questions before you open the workspace" description="Quick answers about AI chat, files, model comparison, and saved research." />
      <FAQAccordion items={faqs} />
    </section>
  );
}
