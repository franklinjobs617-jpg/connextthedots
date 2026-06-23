import type { Metadata } from "next";

const officialStoreUrl = "https://www.brooksbrothers.com.sg/#/home";
const heroImage = "/shopping-guide/workwear-editorial.png";

export const metadata: Metadata = {
  title: "The Workday Wardrobe Test for Singapore Professionals",
  description:
    "A content page about building a classic workday wardrobe and why Brooks Brothers Singapore is worth checking.",
  robots: {
    index: false,
    follow: true,
  },
};

const quickNotes = [
  "Good for office shirts, smart casual layers, tailoring, polos, knitwear, and practical gifts.",
  "Less useful if you only want streetwear, gym gear, or the cheapest possible fast-fashion option.",
  "Use the brand site for current prices, stock, delivery terms, promotions, and returns.",
];

const wardrobeTests = [
  {
    label: "The 8:30 meeting test",
    copy: "Can the shirt and trousers look ready before coffee, without needing a full suit to rescue them?",
  },
  {
    label: "The lunch-to-office test",
    copy: "Can the same outfit leave the office for a casual lunch and still feel intentional?",
  },
  {
    label: "The travel day test",
    copy: "Can the pieces survive a warm commute, a cold meeting room, and one last appointment without looking tired?",
  },
  {
    label: "The gift test",
    copy: "Would this be useful to a person whose style you do not completely know? Shirts, knitwear, and accessories usually pass that test better than loud statement pieces.",
  },
];

const faq = [
  {
    question: "Is this the Brooks Brothers Singapore website?",
    answer:
      "No. This content page is powered by ConnectTheDotsPrintable.online and is separate from the advertiser destination page. The links on this page take readers to the Brooks Brothers Singapore website.",
  },
  {
    question: "Why mention Brooks Brothers Singapore here?",
    answer:
      "Because the official store is relevant to classic workwear categories such as shirts, polos, tailoring, knitwear, accessories, and sale items.",
  },
  {
    question: "Who powers this page?",
    answer:
      "This content page is powered by ConnectTheDotsPrintable.online. It is a separate prelander page, not the advertiser destination page.",
  },
  {
    question: "Why not list prices here?",
    answer:
      "Prices, stock, promotions, shipping, and return terms can change. The brand site is the right place to check those details.",
  },
];

function StoreButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={officialStoreUrl}
      rel="sponsored noopener noreferrer"
      className="inline-flex items-center justify-center rounded-sm bg-[#1d3557] px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#13233a]"
    >
      {children}
    </a>
  );
}

export default function BrooksBrothersSingaporeGuide() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-28 text-[#22201d]">
      <header className="border-b border-[#e2ded5] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <a
            href="#top"
            className="font-serif text-lg tracking-[0.08em] text-[#22201d]"
          >
            THE WORKDAY EDIT
          </a>
          <a
            href="#powered-by"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6b55] underline-offset-4 hover:underline"
          >
            Powered by ConnectTheDotsPrintable.online
          </a>
        </div>
      </header>

      <article id="top" className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,680px)_280px] lg:items-start">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8a6a35]">
              Workwear Shopping Read
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-[#15130f] md:text-6xl">
              The small workwear test I would use before shopping Brooks
              Brothers Singapore
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5a52]">
              Most office clothes fail in boring ways. Not dramatic. Not
              Instagram-bad. They just make the day slightly harder than it
              needs to be.
            </p>
            <figure className="mt-7 overflow-hidden border border-[#ded6c8] bg-[#efe8dc]">
              <img
                src={heroImage}
                alt="Classic smart casual workwear with shirts, blazer, chinos, belt, and loafers arranged in a bright dressing area"
                className="aspect-[16/9] w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-xs leading-5 text-[#6b6258]">
                Editorial visual created for this guide. It is not official
                Brooks Brothers Singapore product photography.
              </figcaption>
            </figure>
            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[#e2ded5] py-4 text-sm text-[#6b6258]">
              <span>By Editorial Shopping Desk</span>
              <span className="h-1 w-1 rounded-full bg-[#b9ad9c]" />
              <span>Updated June 2026</span>
              <span className="h-1 w-1 rounded-full bg-[#b9ad9c]" />
              <span>6 min read</span>
            </div>
          </div>

          <aside
            id="powered-by"
            className="border border-[#ded6c8] bg-[#f2eadc] p-5 text-sm leading-7 text-[#5a5148]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a35]">
              Powered by
            </p>
            <p className="mt-3">
              ConnectTheDotsPrintable.online. This is a separate content page
              created before the advertiser destination page, so readers can get
              context before visiting the brand site.
            </p>
            <div className="mt-5">
              <StoreButton>Shop Official Store</StoreButton>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,680px)_280px]">
          <div className="space-y-8 text-[17px] leading-8 text-[#3f3932]">
            <section className="space-y-5">
              <p>
                You know the kind of outfit I mean. The shirt is technically
                fine, but it wrinkles badly by lunch. The trousers work with one
                pair of shoes and nothing else. The polo looks relaxed in the
                mirror, then too casual the moment you walk into a meeting room.
              </p>
              <p>
                That is usually where workwear gets annoying. Not because people
                do not know how to dress, but because the modern office has
                become weirdly hard to dress for. One hour you are on a call,
                the next hour you are in front of a client, then you are walking
                outside in Singapore humidity, then back into aggressive air
                conditioning.
              </p>
              <p>So the question is not, what looks formal?</p>
              <p>
                The better question is, what survives the whole day without
                making you think about it?
              </p>
            </section>

            <section className="border-l-4 border-[#1d3557] bg-[#f4f0e8] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a35]">
                The useful filter
              </p>
              <h2 className="mt-3 font-serif text-2xl text-[#15130f]">
                A good workday wardrobe should do three jobs quietly.
              </h2>
              <p className="mt-3">
                It should look put together, move across several settings, and
                avoid making every morning feel like a styling project. That is
                the entire game.
              </p>
            </section>

            <section className="space-y-5">
              <p>
                This is why Brooks Brothers Singapore is a sensible store to
                check if you already lean toward classic style. The official
                site covers the obvious workwear lanes, shirts, polos, tailoring,
                knitwear, accessories, and sale items. Nothing exotic there.
                That is kind of the point.
              </p>
              <p>
                Classic clothes are not supposed to win attention in the first
                three seconds. They are supposed to be useful on the twentieth
                wear, when the novelty is gone and you still reach for them
                because they solve the problem.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl text-[#15130f]">
                The four checks I would run before buying
              </h2>
              <div className="mt-6 divide-y divide-[#ded6c8] border-y border-[#ded6c8]">
                {wardrobeTests.map((item) => (
                  <div key={item.label} className="py-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a35]">
                      {item.label}
                    </p>
                    <p className="mt-3 text-[#5f5a52]">{item.copy}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <p>
                There is also a gift angle here, and I think it matters more
                than people admit.
              </p>
              <p>
                Buying clothes for someone else is risky. Sizes are personal.
                Taste is personal. Even the meaning of smart casual changes from
                one office to another. So if you are shopping for a partner,
                colleague, parent, or graduate, the safer move is not to find
                the loudest piece. It is to find something that can enter an
                existing wardrobe without asking for permission.
              </p>
              <p>
                Shirts, knitwear, belts, and quiet accessories usually have a
                better chance there.
              </p>
            </section>

            <section className="bg-[#13233a] p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8bd7f]">
                Reader next step
              </p>
              <h2 className="mt-3 font-serif text-3xl">
                If this sounds like the kind of wardrobe you are trying to
                build, the brand site is the right next tab.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#efe7d8]">
                Use it to compare current shirts, polos, tailoring, knitwear,
                sale items, prices, delivery details, and returns.
              </p>
              <div className="mt-6">
                <a
                  href={officialStoreUrl}
                  rel="sponsored noopener noreferrer"
                  className="inline-flex rounded-sm bg-white px-5 py-3 text-sm font-semibold tracking-wide text-[#13233a] transition hover:bg-[#efe7d8]"
                >
                  Visit Brooks Brothers Singapore
                </a>
              </div>
            </section>

            <section className="space-y-5">
              <p>
                To be clear, this is not for everyone. If your wardrobe is built
                around streetwear, technical sportswear, or very trend-heavy
                pieces, this probably is not the most natural place to start.
              </p>
              <p>
                But if your problem is simpler, if you just want clothes that
                make weekdays easier, the Brooks Brothers Singapore site is
                worth a look.
              </p>
              <p>
                Not because every item will be right for you. That would be too
                neat, and real shopping is rarely that neat.
              </p>
              <p>
                Because it gives you a clean place to compare the classic
                categories first.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl text-[#15130f]">
                A few questions before you click
              </h2>
              <div className="mt-5 divide-y divide-[#ded6c8] border-y border-[#ded6c8]">
                {faq.map((item) => (
                  <details key={item.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl text-[#15130f]">
                      {item.question}
                      <span className="text-2xl transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-base leading-7 text-[#5f5a52]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-5">
              <div className="border border-[#ded6c8] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a35]">
                  Article note
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5f5a52]">
                  The point is not to dress more formally. The point is to buy
                  fewer pieces that work across more of the week.
                </p>
              </div>
              <div className="border border-[#ded6c8] bg-[#f2eadc] p-5">
                <p className="font-serif text-2xl text-[#15130f]">
                  Check current Brooks Brothers Singapore categories.
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5f5a52]">
                  {quickNotes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a6a35]" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <StoreButton>Go to Official Store</StoreButton>
                </div>
              </div>
              <div className="overflow-hidden border border-[#ded6c8] bg-white">
                <img
                  src={heroImage}
                  alt="Neutral smart casual wardrobe with shirts, blazer, trousers, and loafers"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </aside>
        </div>
      </article>

      <footer className="border-t border-[#e2ded5] bg-[#22201d] px-5 py-8 text-[#d8d0c3]">
        <div className="mx-auto max-w-5xl text-xs leading-6">
          Powered by ConnectTheDotsPrintable.online. This content page is
          separate from the advertiser destination page.
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#d8cbb8] bg-[#fbfaf7]/95 px-4 py-3 shadow-[0_-10px_30px_rgba(34,32,29,0.12)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6a35]">
              Official-store link
            </p>
            <p className="text-sm text-[#5f5a52]">
              Browse current Brooks Brothers Singapore styles, prices, and
              availability on the official website.
            </p>
          </div>
          <a
            href={officialStoreUrl}
            rel="sponsored noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-sm bg-[#1d3557] px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#13233a]"
          >
            Visit Official Store
          </a>
        </div>
      </div>
    </main>
  );
}
