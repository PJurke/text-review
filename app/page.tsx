import logger from "@/lib/logger";

import HeroSection from "./_components/HeroSection";
import PurposeSection from "./_components/PurposeSection";
import FeatureSection from "./_components/FeatureSection";

export default function Home() {

  logger.info(`Homepage: Page invoked`);

  return (

    <main>
      <HeroSection />
      <PurposeSection />
      <FeatureSection />
    </main>

  );
}