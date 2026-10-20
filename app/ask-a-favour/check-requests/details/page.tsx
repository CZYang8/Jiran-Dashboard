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

const CheckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.500l4.500 4.500L19 7.500" />
  </svg>
);

/* ---------- Request data: edit these to change what the page shows ---------- */

const request = {
  title: "Collect medicine from Almara Pharmacy",
  message:
    "Could you swing by Almara Pharmacy and collect my medicine for me? I'd go myself but I'm a bit tied up today. They should already have it ready, it's under my name, so you can just tell them you're picking it up for me. Oh and if they ask for anything, I can send you a photo of the prescription. Thanks so much, I really appreciate it.",
};

const progress: { title: string; detail: string; done: boolean }[] = [
  { title: "Request Sent", detail: "Today, 10:15 am", done: true },
  { title: "Helper Found", detail: "Aiman, No. 22 Jalan SP 10/3", done: true },
  { title: "Done", detail: "Not yet", done: false },
];

export default function RequestDetailsPage() {
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
          <h1 className="m-0 text-4xl font-bold md:text-5xl">Request Details</h1>

          <Link
            href="/ask-a-favour/check-requests"
            className="flex cursor-pointer items-center gap-2 rounded-[20px] border border-[#e6e4df] bg-white px-8 py-4 text-xl font-bold text-[#0b1322] no-underline hover:border-[#ccc9c7] hover:bg-[#e6e6e6] md:text-2xl"
          >
            <BackIcon />
            Back
          </Link>
        </header>

        <section className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[1.1fr_1fr]">
          {/* Request text */}
          <article className="rounded-[30px] border border-[#e6e4df] bg-white p-6">
            <h2 className="m-0 text-2xl font-bold md:text-3xl">
              {request.title}
            </h2>
            <p className="m-0 mt-4 text-lg leading-relaxed text-[#333] md:text-xl">
              {request.message}
            </p>
          </article>

          {/* Progress */}
          <article className="rounded-[30px] border border-[#e6e4df] bg-white p-6">
            <h2 className="m-0 text-2xl font-bold md:text-3xl">Progress</h2>

            <ol className="m-0 mt-6 list-none p-0">
              {progress.map((step, i) => {
                const isLast = i === progress.length - 1;
                return (
                  <li key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full ${
                          step.done ? "bg-[#12805c]" : "bg-[#777]"
                        }`}
                      >
                        {step.done && <CheckIcon />}
                      </span>
                      {!isLast && (
                        <span className="min-h-[28px] w-[4px] flex-1 bg-[#12805c]" />
                      )}
                    </div>

                    <div className={isLast ? "" : "pb-6"}>
                      <p className="m-0 text-xl font-bold">{step.title}</p>
                      <p className="m-0 text-base text-[#555]">{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </article>
        </section>
      </main>
    </div>
  );
}
