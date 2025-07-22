import Transport from 'winston-transport';
import { Logform } from 'winston';
import { Buffer } from 'buffer';

interface LokiCloudTransportOptions extends Transport.TransportStreamOptions {

    host: string;
    user: string;
    apiKey: string;
    labels?: { [key: string]: string };

}

export default class LokiCloudTransport extends Transport {

    private host: string;
    private basicAuth: string;
    private labels: { [key: string]: string };

    // Constructor

    constructor(options: LokiCloudTransportOptions) {
        super(options);
        this.host = options.host;
        this.basicAuth = Buffer.from(`${options.user}:${options.apiKey}`).toString('base64');
        this.labels = options.labels || {};
    }

    public log(info: Logform.TransformableInfo, callback: () => void): void {

        setImmediate(() => {
            this.emit('logged', info);
        });

        const { level, message, ...meta } = info;

        // Define the structure of the Loki payload for type safety
        const logEntry = {
            streams: [ {
                stream: {
                    ...this.labels,
                    level: level,
                },
                values: [
                    // Loki expects the timestamp as a string in nanoseconds
                    [`${Date.now()}000000`, JSON.stringify({ message, ...meta })],
                ],
            } ],
        };

        // Send the data to the Loki API via fetch
        fetch(`${this.host}/loki/api/v1/push`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${this.basicAuth}`,
            },
            body: JSON.stringify(logEntry),
        }).catch((err) => {
            console.error('Error sending log to Loki:', err);
        });

        // Signal to Winston that the write operation is complete
        callback();

    }

}