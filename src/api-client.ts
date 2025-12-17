import type { EventData, TicketmasterApiResponse, TicketmasterEvent, TicketmasterInput } from './types.js';
import { CATEGORY_MAPPING } from './types.js';

/**
 * Ticketmaster Discovery API v2 Client
 * Documentation: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */
export class TicketmasterApiClient {
    private readonly baseUrl = 'https://app.ticketmaster.com/discovery/v2';
    private readonly apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Ticketmaster API key is required');
        }
        this.apiKey = apiKey;
    }

    /**
     * Search for events using Discovery API
     */
    async searchEvents(
        input: TicketmasterInput,
        page = 0,
        size = 20
    ): Promise<TicketmasterApiResponse> {
        const url = new URL(`${this.baseUrl}/events.json`);
        
        // Add API key
        url.searchParams.append('apikey', this.apiKey);

        // Add keyword (location)
        url.searchParams.append('keyword', input.location);

        // Add classification (category)
        const classificationId = CATEGORY_MAPPING[input.category];
        url.searchParams.append('classificationId', classificationId);

        // Add date range if provided
        if (input.startDate) {
            url.searchParams.append('startDateTime', `${input.startDate}T00:00:00Z`);
        }
        if (input.endDate) {
            url.searchParams.append('endDateTime', `${input.endDate}T23:59:59Z`);
        }

        // Add pagination
        url.searchParams.append('page', String(page));
        url.searchParams.append('size', String(size));

        // Add sorting - by date ascending
        url.searchParams.append('sort', 'date,asc');

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your Ticketmaster API key.');
                }
                if (response.status === 403) {
                    throw new Error('API access forbidden. Check your API key permissions.');
                }
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as TicketmasterApiResponse;
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Failed to fetch events: ${String(error)}`);
        }
    }

    /**
     * Transform API event to our EventData format
     */
    static transformEvent(event: TicketmasterEvent): EventData {
        // Extract event name
        const name = event.name || 'Unknown Event';

        // Extract date
        let date = new Date().toISOString();
        if (event.dates?.start?.dateTime) {
            date = event.dates.start.dateTime;
        } else if (event.dates?.start?.localDate && event.dates?.start?.localTime) {
            date = `${event.dates.start.localDate}T${event.dates.start.localTime}`;
        } else if (event.dates?.start?.localDate) {
            date = `${event.dates.start.localDate}T00:00:00`;
        }

        // Extract venue
        // eslint-disable-next-line no-underscore-dangle
        const venues = event._embedded?.venues || [];
        let venue = 'Venue not specified';
        if (venues.length > 0) {
            const venueInfo = venues[0];
            const parts: string[] = [];
            if (venueInfo.name) parts.push(venueInfo.name);
            if (venueInfo.city?.name) parts.push(venueInfo.city.name);
            if (venueInfo.state?.stateCode) parts.push(venueInfo.state.stateCode);
            if (venueInfo.country?.countryCode) parts.push(venueInfo.country.countryCode);
            venue = parts.join(', ') || 'Venue not specified';
        }

        // Extract price range
        let priceRange = 'Price not available';
        const priceRanges = event.priceRanges || [];
        if (priceRanges.length > 0) {
            const price = priceRanges[0];
            if (price.min !== undefined && price.max !== undefined) {
                const currency = price.currency || 'USD';
                priceRange = `${currency} ${price.min} - ${currency} ${price.max}`;
            } else if (price.min !== undefined) {
                const currency = price.currency || 'USD';
                priceRange = `From ${currency} ${price.min}`;
            }
        }

        // Extract URL
        const url = event.url || '';

        // Extract image - prefer 16:9 ratio, fallback to first available
        let image: string | null = null;
        if (event.images && event.images.length > 0) {
            // Try to find 16:9 image first
            const image169 = event.images.find((img) => img.ratio === '16_9' && !img.fallback);
            if (image169) {
                image = image169.url;
            } else {
                // Fallback to first non-fallback image
                const firstImage = event.images.find((img) => !img.fallback);
                if (firstImage) {
                    image = firstImage.url;
                } else if (event.images[0]) {
                    image = event.images[0].url;
                }
            }
        }

        return {
            name,
            date,
            venue,
            priceRange,
            url,
            image,
        };
    }
}

