/**
 * Input parameters for the Ticketmaster API scraper
 */
export interface TicketmasterInput {
    /** Ticketmaster Discovery API key */
    apiKey: string;
    /** City or region (e.g., "New York" or "London") */
    location: string;
    /** Category of events (e.g., "music", "sports", "theater") */
    category: 'music' | 'sports' | 'theater';
    /** Optional start date in format "YYYY-MM-DD" */
    startDate?: string;
    /** Optional end date in format "YYYY-MM-DD" */
    endDate?: string;
    /** Maximum number of pages to paginate (default: 5) */
    maxPages?: number;
    /** Number of events per page (default: 20) */
    pageSize?: number;
}

/**
 * Ticketmaster API classification mapping
 * Based on Discovery API v2 documentation
 */
export const CATEGORY_MAPPING: Record<TicketmasterInput['category'], string> = {
    music: 'KZFzniwnSyZfZ7v7nJ', // Music
    sports: 'KZFzniwnSyZfZ7v7nE', // Sports
    theater: 'KZFzniwnSyZfZ7v7na', // Arts & Theatre
} as const;

/**
 * Event data structure from API response
 */
export interface EventData {
    /** Event name */
    name: string;
    /** Event date and time in ISO 8601 format */
    date: string;
    /** Venue name and location */
    venue: string;
    /** Price range (e.g., "$50 - $200") */
    priceRange: string;
    /** URL to the event page */
    url: string;
    /** URL to the event image */
    image: string | null;
}

/**
 * Ticketmaster API Response Types
 */
export interface TicketmasterApiResponse {
     
    _embedded?: {
        events?: TicketmasterEvent[];
    };
    _links?: {
        self?: { href: string };
        next?: { href: string };
        prev?: { href: string };
    };
    page?: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

export interface TicketmasterEvent {
    id: string;
    name: string;
    url: string;
    images?: {
        url: string;
        width: number;
        height: number;
        ratio?: string;
        fallback?: boolean;
    }[];
    dates?: {
        start?: {
            localDate?: string;
            localTime?: string;
            dateTime?: string;
            dateTBD?: boolean;
            dateTBA?: boolean;
            timeTBA?: boolean;
            noSpecificTime?: boolean;
        };
        timezone?: string;
        status?: {
            code?: string;
        };
    };
     
    _embedded?: {
        venues?: {
            name: string;
            city?: { name: string };
            state?: { name: string; stateCode: string };
            country?: { name: string; countryCode: string };
            address?: { line1?: string };
            postalCode?: string;
        }[];
        attractions?: {
            name: string;
        }[];
    };
    priceRanges?: {
        type?: string;
        currency?: string;
        min?: number;
        max?: number;
    }[];
    classifications?: {
        primary?: boolean;
        segment?: { name: string };
        genre?: { name: string };
        subGenre?: { name: string };
    }[];
}
