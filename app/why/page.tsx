import { Metadata } from "next";

import logger from "@/lib/logger";
import TheGoldenCircleSection from "./_components/TheGoldenCircleSection";
import EvolutionaryApproachSection from "./_components/EvolutionaryApproachSection";
import { WhySection } from "./_components/WhySection";
import HowSection from "./_components/HowSection";
import WhatSection from "./_components/WhatSection";

export const metadata: Metadata = {
    title: 'Why'
};

export default function WhyPage(): JSX.Element {

    logger.info(`Why Page: Page invoked`);

    return (
        <>
            <WhySection />
            <HowSection />
            <WhatSection />
            <EvolutionaryApproachSection />
        </>
    );
}