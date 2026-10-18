import { MARK, HERO } from "./frag";
import Clock from "./Clock";
import { HeroDock } from "@/components/HeroDock";
import { HeroEffects } from "@/components/HeroEffects";
import { Statement } from "@/components/Statement";
import { Desktop } from "@/components/Desktop";
import { Toolkit } from "@/components/Toolkit";
import { Work } from "@/components/Work";
import { Craft } from "@/components/Craft";
import { ContactSection, SiteFooter, BitField } from "@/components/chrome";

export default function Home() {
  return (
    <div id="site-shell">
      <main id="main">
        <div data-page="true">
          <div dangerouslySetInnerHTML={{ __html: MARK + HERO }} />
          <Statement />
          <Desktop />
          <Toolkit />
          <Work />
          <Craft />
          <div aria-hidden="true" className="tone-paper bg-bg h-[clamp(64px,9vw,140px)]" />
          <ContactSection />
        </div>
        <BitField />
      </main>
      <SiteFooter />
      <HeroDock />
      <HeroEffects />
      <Clock />
    </div>
  );
}
