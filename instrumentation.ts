import { initializeLokiTransport } from "./lib/logger";

export async function register() {
    console.log("Instrumentation hook running. Initializing Loki transport...");
    initializeLokiTransport();
}