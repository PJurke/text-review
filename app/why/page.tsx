import { Metadata } from "next";

import logger from "@/lib/logger";
import TheGoldenCircleSection from "./_components/TheGoldenCircleSection";
import EvolutionaryApproachSection from "./_components/EvolutionaryApproachSection";

export const metadata: Metadata = {
    title: 'Why'
};

export default function WhyPage(): JSX.Element {

    logger.info(`Why Page: Page invoked`);

    return (
        <>
            <TheGoldenCircleSection />
            <EvolutionaryApproachSection />
        </>
    );
}