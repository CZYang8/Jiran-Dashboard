import Link from "next/link";

/* ---------- Broadcast content: later, fill this from the triggering event ---------- */

const broadcast = {
  label: "Emergency Broadcast",
  title: "Flash flood warning",
  message:
    "Heavy rain in Elmina for the next 2 hours. Move cars off Jalan 5 and stay indoors. The estate team is on standby.",
};

export default function EmergencyPage() {
  return (
    <div
      role="alert"
      className="flex min-h-screen w-full items-center bg-[#d71920] px-8 py-10 text-white [font-family:Metropolis,ui-sans-serif,system-ui,sans-serif] md:px-14"
    >
      <main className="flex max-w-[900px] flex-col gap-4">
        <p className="m-0 text-lg font-bold uppercase md:text-xl">
          {broadcast.label}
        </p>

        <h1 className="m-0 text-5xl font-bold leading-tight md:text-7xl">
          {broadcast.title}
        </h1>

        <p className="m-0 text-2xl leading-snug md:text-3xl">
          {broadcast.message}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="cursor-pointer rounded-[14px] bg-[#0b1322] px-10 py-5 text-xl font-bold text-white no-underline hover:bg-[#1c2a44] md:text-2xl"
          >
            I&apos;m Safe
          </Link>

          <button className="cursor-pointer rounded-[14px] border-none bg-white px-10 py-5 text-xl font-bold text-[#0b1322] hover:bg-[#e6e6e6] md:text-2xl">
            I need help
          </button>
        </div>
      </main>
    </div>
  );
}
