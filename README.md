# 🎫 Ticketmaster Event Scraper: Concert, Sports & Theater Events Extractor

Enterprise-grade event scraper that automatically extracts live events from Ticketmaster Discovery API — concerts, sports games, theater shows, and more. Clean, structured data ready for event discovery platforms, ticketing systems, or AI training.

**High-quality Event Data Scraper for Ticketing Platforms, Event Aggregators, and Developers**

Automatically collects events from Ticketmaster by location, category, and date range — concerts, sports, theater, and arts events. Clean, structured JSON output ready for integration or analysis.

**Built for:**

- Event discovery platforms and aggregators
- Ticketing systems and booking services
- Travel and entertainment apps
- AI/ML engineers building event recommendation models
- Event organizers and venue managers
- Marketing teams tracking local events

✅ **Official Ticketmaster Discovery API** — No scraping, no blocks, reliable data  
✅ **Smart filtering** by location, category, and date range  
✅ **Rich event metadata** (name, date, venue, price range, images, URLs)  
✅ **Automatic pagination** with configurable limits  
✅ **Rate limiting** built-in (respects API limits: 5 req/sec, 5000/day)  
✅ **Clean structured output** — ready for databases or APIs  
✅ **AI-ready datasets** — perfect for event recommendation systems  

👉 **Runs on Apify • No code required • Pay only for compute used**

## 🚀 Why This Scraper

✔ **Official API Integration**  
Uses Ticketmaster's official Discovery API v2 — no web scraping, no anti-bot measures, 100% reliable data access.

✔ **Comprehensive Event Data**  
Extracts complete event information: name, date/time, venue details, price ranges, images, and direct purchase URLs.

✔ **Smart Filtering & Search**  
Filter by location (city/region), category (music, sports, theater), and optional date ranges for precise results.

✔ **Efficient Pagination**  
Automatic pagination with configurable page limits. Supports up to 1000 events per query (API limit) with intelligent page management.

✔ **Production-Ready**  
Built with TypeScript, explicit types, error handling, and rate limiting. Follows Apify best practices for reliability.

✔ **Fast & Reliable**  
Direct API calls — no HTML parsing, no browser overhead. Fast response times and consistent data structure.

✔ **Safe & Controlled**  
Built-in rate limiting (4 requests/second, safe margin from API limit of 5/sec). Automatic retry logic and error handling.

## 💼 Use Cases

- **Event discovery platforms** — aggregate events from Ticketmaster
- **Travel apps** — show local events to travelers
- **Ticketing systems** — sync events for booking platforms
- **Event recommendation engines** — training data for ML models
- **Marketing automation** — track events for promotional campaigns
- **Venue management** — monitor competitor events
- **Research & analytics** — event trend analysis

## 📊 Supported Event Types

- **Music & Concerts** — Live music events, concerts, festivals
- **Sports** — Professional and amateur sports events
- **Theater & Arts** — Theater shows, arts performances, cultural events

## ⚙️ How It Works

1. Provide your Ticketmaster API key (get free at [developer.ticketmaster.com](https://developer.ticketmaster.com/))
2. Set location, category, and optional filters
3. Run the Actor
4. Download clean, structured event datasets

## 🧩 Input Configuration

### Example JSON Input

```json
{
  "apiKey": "YOUR_TICKETMASTER_API_KEY",
  "location": "New York",
  "category": "music",
  "startDate": "2025-12-01",
  "endDate": "2026-01-31",
  "maxPages": 5,
  "pageSize": 20
}
```

### Key Options

- **`apiKey`** — Your Ticketmaster Discovery API key (required)  
  Get it free at: https://developer.ticketmaster.com/

- **`location`** — City or region to search (required)  
  Examples: "New York", "London", "Los Angeles", "Chicago"

- **`category`** — Event category (required)  
  Options: `"music"`, `"sports"`, `"theater"`

- **`startDate`** — Optional start date filter (format: YYYY-MM-DD)  
  Example: `"2025-12-01"`

- **`endDate`** — Optional end date filter (format: YYYY-MM-DD)  
  Example: `"2026-01-31"`

- **`maxPages`** — Maximum pages to fetch (default: 5, max: 20)  
  API supports up to 1000 items total (size × page < 1000)

- **`pageSize`** — Events per page (default: 20, max: 200)  
  Recommended: 20-50 for optimal performance

## 📂 Output Dataset

Single dataset with all event records, structured and ready for use.

### Example Output Record

```json
{
  "name": "Taylor Swift | The Eras Tour",
  "date": "2025-12-20T20:00:00Z",
  "venue": "Madison Square Garden, New York, NY, US",
  "priceRange": "USD 150 - USD 500",
  "url": "https://www.ticketmaster.com/taylor-swift-new-york-new-york-12-20-2025/event/0000632F8EED107C",
  "image": "https://s1.ticketm.net/dam/a/3a7/9ac81990-3bca-42bb-8473-47dfb2f493a7_RETINA_PORTRAIT_16_9.jpg"
}
```

### Output Fields

- **`name`** — Event name/title
- **`date`** — Event date and time (ISO 8601 format)
- **`venue`** — Venue name with full location (city, state, country)
- **`priceRange`** — Price range when available (format: "USD min - USD max")
- **`url`** — Direct link to event page on Ticketmaster
- **`image`** — Event image URL (high-quality, 16:9 ratio preferred)

## 🏁 Getting Started

1. **Get API Key**  
   Sign up at [developer.ticketmaster.com](https://developer.ticketmaster.com/) and create an app to get your free API key.

2. **Configure Input**  
   Set your API key, location, and category in the Apify Console or `INPUT.json`.

3. **Run the Actor**  
   Click "Run" in Apify Console or use `apify run` locally.

4. **Download Results**  
   Export your dataset as JSON, CSV, or access via Apify API.

## 📊 API Limits & Quotas

- **Daily quota:** 5,000 API calls per day
- **Rate limit:** 5 requests per second (scraper uses 4/sec for safety)
- **Deep paging:** Up to 1,000 items (size × page < 1000)
- **Free tier:** Sufficient for most use cases

## 🔧 Technical Details

- **Built with:** TypeScript, Apify SDK, Ticketmaster Discovery API v2
- **Base image:** `apify/actor-node:22` (lightweight, no browser)
- **Data source:** Official Ticketmaster Discovery API
- **Output format:** JSON (structured event data)

## 📧 Support

- **Email**: **kidaxxb@gmail.com**
- **Issues:** Use Apify Issues tab in the Actor page
- **API Docs:** [Ticketmaster Discovery API v2](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

**Tags:** `ticketmaster`, `events`, `concerts`, `sports`, `theater`, `ticketing`, `event-discovery`, `live-events`, `entertainment`, `api-integration`, `event-aggregator`, `ticket-booking`

---

**Built with ❤️ on Apify**
