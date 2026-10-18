import type { Metadata } from "next";
import { ContactSection } from "@/components/chrome/ContactSection";
import { person } from "@/content/punya";

const description = `Get in touch with ${person.name} about freelance projects, internships or an AI product that needs building. Email, socials and a contact form.`;
export const metadata: Metadata = {
  title: `Contact — ${person.name}`,
  description,
  openGraph: { title: `Contact ${person.name} — AI/ML engineer in ${person.city}`, description, type: "website", locale: "en_IN" },
};

export default function ContactPage() {
  return (
    <main id="main">
      <div data-page="true">
        <h1 className="sr-only">Contact {person.name}</h1>
        <ContactSection />
      </div>
    </main>
  );
}
