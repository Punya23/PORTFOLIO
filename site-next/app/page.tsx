import Clock from "./Clock";
import { HEADER, MARK, HERO } from "./frag";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HEADER }} />
      <div id="site-shell">
        <main id="main">
          <div data-page="true">
            <div dangerouslySetInnerHTML={{ __html: MARK + HERO }} />
          </div>
        </main>
      </div>
      <Clock />
    </>
  );
}
