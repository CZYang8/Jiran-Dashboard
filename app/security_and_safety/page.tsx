import Link from "next/link";

const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 8V4l-8 8 8 8v-4.1c5.6 0 9.5 1.8 12 5.6-1-6-4.6-10.9-12-11.5z" />
  </svg>
);

type Tone = "green" | "yellow" | "red";

const dotClasses: Record<Tone, string> = {
  green: "bg-[#12805c]",
  yellow: "bg-[#fcaf17]",
  red: "bg-[#d71920]",
};

const pillClasses: Record<Tone, string> = {
  green: "bg-[#12805c] text-white",
  yellow: "bg-[#fcaf17] text-[#0b1322]",
  red: "bg-[#d71920] text-white",
};

// Up to 10 min is fine, up to 20 min is getting stale, anything later is overdue.
const toneFor = (minutesAgo: number): Tone =>
  minutesAgo <= 10 ? "green" : minutesAgo <= 20 ? "yellow" : "red";

/* ---------- Patrols data: edit this list to change the rows ---------- */
/* Later, fill this from the guard check-in events (e.g. Supabase). */

const patrols: { id: number; street: string; minutesAgo: number }[] = [
  { id: 1, street: "Jalan Elmina 3", minutesAgo: 5 },
  { id: 2, street: "Jalan Elmina 4", minutesAgo: 15 },
  { id: 3, street: "Jalan Elmina 6", minutesAgo: 21 },
  { id: 4, street: "Jalan Elmina 8", minutesAgo: 35 },
];

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f7f9f6] text-[#0b1322] [font-family:Metropolis,ui-sans-serif,system-ui,sans-serif]">
      {/* Top colour bar */}
      <div className="grid h-4 w-full grid-cols-4">
        <div className="bg-[#d71920]" />
        <div className="bg-[#f15a22]" />
        <div className="bg-[#f58220]" />
        <div className="bg-[#fcaf17]" />
      </div>

      <main className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <h1 className="m-0 text-4xl font-bold md:text-5xl">
            Security and Safety
          </h1>

          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2 rounded-[20px] border border-[#e6e4df] bg-white px-8 py-4 text-xl font-bold text-[#0b1322] no-underline hover:border-[#ccc9c7] hover:bg-[#e6e6e6] md:text-2xl"
          >
            <BackIcon />
            Back to Home
          </Link>
        </header>

        <section className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          {/* Guardian Angel */}
          <article className="flex flex-col gap-6 rounded-[30px] border border-[#e6e4df] bg-white p-8">
            <h2 className="m-0 text-3xl font-bold md:text-4xl">
              Guardian Angel
            </h2>

            <p className="m-0 text-xl leading-snug text-[#777] md:text-2xl">
              If you don&apos;t get home by the expected time, we will check on
              you before alerting your trusted neighbours.
            </p>

            <button className="mt-auto cursor-pointer rounded-[20px] border-none bg-[#fcaf17] px-8 py-6 text-xl font-bold text-[#0b1322] hover:bg-[#ffc23d] md:text-2xl">
              Check your phone for any active guardian angel
            </button>

            <p className="m-0 text-center text-base text-[#777]">
              Don&apos;t forget to check in if you have set a guardian angel.
            </p>
          </article>

          {/* Ongoing Patrols */}
          <article className="flex flex-col gap-4 rounded-[30px] border border-[#e6e4df] bg-white p-8">
            <h2 className="m-0 text-3xl font-bold md:text-4xl">
              Ongoing Patrols
            </h2>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {patrols.map((p) => {
                const tone = toneFor(p.minutesAgo);
                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 rounded-[20px] border border-[#e6e4df] px-6 py-5"
                  >
                    <span className="flex items-center gap-3 text-xl font-bold md:text-2xl">
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${dotClasses[tone]}`}
                        aria-hidden="true"
                      />
                      {p.street}
                    </span>

                    <span
                      className={`shrink-0 rounded-full px-4 py-1 text-base font-bold ${pillClasses[tone]}`}
                    >
                      {p.minutesAgo} minutes ago
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="m-0 mt-auto text-center text-base text-[#777]">
              Times shown are the time the guard checked in at the street.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
