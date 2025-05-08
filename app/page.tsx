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
      <section className="bg-gray-50 col-span-12 grid grid-cols-subgrid items-center min-h-[50vh] text-gray-800">
        <p className="col-span-12 leading-relaxed text-center text-xl">
          Those who understand can question.<br />
          Those who question can really help shape things.<br />
          I have developed Text Review to help you do this.<br />
        </p>
      </section>

    </main>

  );
}