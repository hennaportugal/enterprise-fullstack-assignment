# Backend Service

This is the backend service for the Chartmetric assignment. It provides a REST API for accessing music streaming analytics data.

## Setup

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode (with hot reload)
npm run dev
```

## Environment Variables

The service can be configured using the following environment variables:

```env
DB_HOST=db              # PostgreSQL host (default: 'db')
DB_PORT=5432           # PostgreSQL port (default: 5432)
DB_USER=postgres       # PostgreSQL user (default: 'postgres')
DB_PASSWORD=postgres   # PostgreSQL password (default: 'postgres')
DB_NAME=chartmetric    # PostgreSQL database name (default: 'chartmetric')
```

## Database Functions

The `db.js` module provides several utility functions for database operations:

### query(text, params)

Execute a SQL query with optional parameters.

```javascript
const { query } = require('./db');

// Example: Get all tracks for an artist
const getArtistTracks = async (artistId) => {
  const text = 'SELECT * FROM tracks WHERE artist_id = $1';
  const params = [artistId];
  const result = await query(text, params);
  return result.rows;
};
```

### ping()

Check database connectivity.

```javascript
const { ping } = require('./db');

// Example: Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await ping();
    res.json({ status: 'healthy' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});
```

### transaction(callback)

Execute multiple queries within a transaction. The callback receives a client instance to run queries.

```javascript
const { transaction } = require('./db');

// Example: Update track metrics in a transaction
const updateTrackMetrics = async (trackId, metrics) => {
  await transaction(async (client) => {
    // Update daily metrics
    await client.query(
      'UPDATE daily_metrics SET streams = $1, saves = $2 WHERE track_id = $3',
      [metrics.streams, metrics.saves, trackId]
    );

    // Update track's total metrics
    await client.query(
      'UPDATE tracks SET total_streams = total_streams + $1 WHERE track_id = $2',
      [metrics.streams, trackId]
    );
  });
};
```

## API Routes

The API routes are organized in the `routes` directory. Each route module exports an Express router with its endpoints.
