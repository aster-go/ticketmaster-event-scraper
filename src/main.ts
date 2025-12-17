import { Actor } from 'apify';

import { TicketmasterApiClient } from './api-client.js';
import type { TicketmasterInput } from './types.js';
import { getNextMonthEnd, getPreviousMonthStart, isValidDateFormat } from './utils.js';

// Initialize the Actor
await Actor.init();

// Get input parameters
const input = await Actor.getInput<TicketmasterInput>();

if (!input) {
    throw new Error('Input is required. Please provide apiKey, location and category.');
}

// Validate required fields
if (!input.apiKey) {
    throw new Error('API key is required. Get your Ticketmaster API key from https://developer.ticketmaster.com/');
}

if (!input.location || !input.category) {
    throw new Error('Location and category are required fields.');
}

// Set default dates if not provided
// Default: previous month start to next month end
const startDate = input.startDate || getPreviousMonthStart();
const endDate = input.endDate || getNextMonthEnd();

// Validate date formats
if (!isValidDateFormat(startDate)) {
    throw new Error(`Invalid startDate format. Expected YYYY-MM-DD, got: ${startDate}`);
}

if (!isValidDateFormat(endDate)) {
    throw new Error(`Invalid endDate format. Expected YYYY-MM-DD, got: ${endDate}`);
}

// Validate date range
const start = new Date(startDate);
const end = new Date(endDate);
if (start > end) {
    throw new Error('startDate must be before or equal to endDate');
}

// Set defaults
const maxPages = Math.min(input.maxPages ?? 5, 20); // API supports up to 1000 items
const pageSize = Math.min(input.pageSize ?? 20, 200); // API max is 200 per page

// Create input with default dates
const inputWithDates: TicketmasterInput = {
    ...input,
    startDate,
    endDate,
};

// Create API client
const apiClient = new TicketmasterApiClient(input.apiKey);

console.log(`Starting to fetch events for ${input.category} in ${input.location}`);
console.log(`Date range: ${startDate} to ${endDate}`);
console.log(`Max pages: ${maxPages}, Page size: ${pageSize}`);

let totalEvents = 0;
let currentPage = 0;

// Fetch events page by page
while (currentPage < maxPages) {
    try {
        console.log(`Fetching page ${currentPage + 1} of ${maxPages}...`);

        // Rate limiting: API allows 5 requests per second
        // Add small delay between requests to respect rate limits
        if (currentPage > 0) {
            const delay = 250; // 250ms = 4 requests per second (safe margin)
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, delay);
            });
        }

        const response = await apiClient.searchEvents(inputWithDates, currentPage, pageSize);

        // Check if we have events
        // eslint-disable-next-line no-underscore-dangle
        const events = response._embedded?.events || [];
        
        if (events.length === 0) {
            console.log('No more events found. Stopping pagination.');
            break;
        }

        console.log(`Found ${events.length} events on page ${currentPage + 1}`);

        // Transform and save events
        const transformedEvents = events.map((event) => 
            TicketmasterApiClient.transformEvent(event)
        );

        await Actor.pushData(transformedEvents);
        totalEvents += transformedEvents.length;

        // Check if there are more pages
        const totalPages = response.page?.totalPages || 0;
        const currentPageNumber = response.page?.number || 0;

        console.log(
            `Page ${currentPageNumber + 1} of ${totalPages} (Total events: ${response.page?.totalElements || 0})`
        );

        // Check if we've reached the last page
        if (currentPageNumber >= totalPages - 1) {
            console.log('Reached the last page. Stopping pagination.');
            break;
        }

        // Check API limit: size * page < 1000
        if ((currentPage + 1) * pageSize >= 1000) {
            console.warn('Reached API deep paging limit (1000 items). Stopping pagination.');
            break;
        }

        currentPage++;
    } catch (error) {
        console.error(`Error fetching page ${currentPage + 1}: ${String(error)}`);
        
        // If it's an API key error, stop immediately
        if (error instanceof Error && error.message.includes('API key')) {
            throw error;
        }
        
        // For other errors, try to continue or stop based on error type
        throw error;
    }
}

console.log(`Successfully fetched ${totalEvents} events total.`);

// Gracefully exit
await Actor.exit();
