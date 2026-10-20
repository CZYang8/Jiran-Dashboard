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

type Tone = "green" | "yellow" | "grey";

const toneClasses: Record<Tone, string> = {
  green: "bg-[#12805c] text-white",
  yellow: "bg-[#fcaf17] text-[#0b1322]",
  grey: "bg-[#777] text-white",
};

/* ---------- Requests data: edit this list to change the rows ---------- */

const requests: {
  id: number;
  title: string;
  status: string;
  tone: Tone;
  asked: string;
}[] = [
  {
    id: 1,
    title: "Collect medicine from Almara Pharmacy",
    status: "Helper found",
    tone: "green",
    asked: "Asked today, 10:15 am",
  },
  {
    id: 2,
    title: "Fix the dripping kitchen tap and check why my sink keeps leaking",
    status: "Waiting for helper",
    tone: "yellow",
    asked: "Asked today, 10:15 am",
  },
  {
    id: 3,
    title: "Sweep my front porch",
    status: "Helper found",
    tone: "grey",
    asked: "Asked today, 10:15 am",
  },
];

export default function CheckRequestsPage() {
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
          <h1 className="m-0 text-4xl font-bold md:text-5xl">Check Requests</h1>

          <Link
            href="/ask-a-favour"
            className="flex cursor-pointer items-center gap-2 rounded-[20px] border border-[#e6e4df] bg-white px-8 py-4 text-xl font-bold text-[#0b1322] no-underline hover:border-[#ccc9c7] hover:bg-[#e6e6e6] md:text-2xl"
          >
            <BackIcon />
            Back
          </Link>
        </header>

        {/* Request list */}
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {requests.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-6 rounded-[20px] border border-[#e6e4df] bg-white px-6 py-5"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <h2 className="m-0 truncate text-xl font-bold md:text-2xl">
                  {r.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-1 text-base font-bold ${toneClasses[r.tone]}`}
                  >
                    {r.status}
                  </span>
                  <span className="text-base text-[#777]">{r.asked}</span>
                </div>
              </div>

              <Link
                href="/ask-a-favour/check-requests/details" className="shrink-0 cursor-pointer rounded-[14px] bg-[#0b1322] px-10 py-4 text-xl font-bold text-white no-underline hover:bg-[#1c2a44] md:text-2xl"
              >
                Details
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
