import Link from "next/link";
import FeatureSection from "./_components/FeatureSection";

export default function Home() {

  return (

    <main>

      { /* Hero Section */ }
      <section className="col-span-12 flex flex-col gap-4 items-center justify-center min-h-[70vh] text-center text-gray-800">
        <h1 className="font-light text-5xl">Text Review</h1>
        <p className="leading-relaxed text-xl">
          Language shapes our interactions.<br />
          Texts carry meaning.</p>
      </section>

      { /* Purpose Section */ }
      <section className="bg-gray-50 flex flex-col items-center justify-center min-h-[50vh] px-4 text-gray-800">
        <p className="leading-relaxed md:max-w-[75ch] text-center text-lg">
          I give you direct access to important information from all over the world - in your language.
          Analyze complex texts in a focused way and at your own pace.
          Gain clarity and form an opinion that is truly your own.
        </p>
        <Link className="mt-4 text-gray-500" href="/why">Read more about the why</Link>
      </section>

      <FeatureSection />

    </main>

  );
}