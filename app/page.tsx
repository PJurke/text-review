export default function Home() {
  return (
    <div className="flex flex-col h-screen">

      <section className="grow flex items-center justify-center flex-col px-4 text-center">
        <h1 className="font-light text-5xl text-gray-800 mb-2">Text Review</h1>
        <p className="text-lg">Language shapes our interactions. Texts carry meaning.</p>
      </section>

      <section>
        <p className="bg-gray-100 px-2 py-16 text-center text-xl">
          Those who understand can question. <br className="hidden sm:inline" />
          Those who question can really help shape things. <br className="hidden sm:inline" />
          I have developed Text Review to help you do this.
        </p>
      </section>

    </div>
  );
}