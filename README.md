# Arr Sync Webhook

Arr Sync Webhook adds content from a *arr instance to another *arr instance automatically.

## Requirements

- Two Sonarr or two Radarr instances
- Node.js / Docker

## Usage

### Webhook Setup

On your main \*arr instance, create a new webhook:

1. Run "On Download" and "On Upgrade"
1. URL should point to `/import/{*arr}` and specify the following query parameters:
   1. (Radarr only) `resolutions`: A comma-separated whitelist of resolutions to sync.
      Current valid resolutions: `r2160P`, `r1080P`, `r720P`, `r480P`, `unknown`
   1. `profile`: Quality profile id to use. Get a list of profile ids from the `/api/profile` endpoint on the secondary instance.
   1. Example URL: `http://localhost:3000/import/radarr?resolutions=r2160P,r1080P&profile=1`.
   1. Example URL: `http://localhost:3000/import/sonarr?profile=1`.
1. Method: `POST`

### Manual methods

In addition to the `/import/{*arr}` webhook, you can also trigger syncs manually. The manual methods use the same URL parameters as the webhook.

#### `/import/radarr/:id`

Imports movie `id`. You can get a list of movie ids using the [API](https://github.com/Radarr/Radarr/wiki/API:Movie#get).

Example: `curl -XPOST http://localhost:3000/import/radarr/1?resolutions=r2160P&profile=1`

#### `/import/radarr/all`

Imports all movies.

Example: `curl -XPOST http://localhost:3000/import/radarr/all?resolutions=r2160P&profile=1`

#### `/import/sonarr/:id`

Imports tv series `id`. You can get a list of tv series ids using the [API](https://github.com/Sonarr/Sonarr/wiki/API:Series#get).

Example: `curl -XPOST http://localhost:3000/import/sonarr/1?profile=1`

#### `/import/sonarr/all`

Imports all tv series.

Example: `curl -XPOST http://localhost:3000/import/sonarr/all?profile=1`

## Installation

### Node.js

Install node modules: `npm install`

### Docker

Create Docker image:

```
docker create \
--name=arr-sync \
-p 3000:3000 \
-e SONARR_SRC_APIKEY=apikey \
-e SONARR_DST_APIKEY=apikey \
-e SONARR_SRC_ROOT="/my/UHD/TV" \
-e SONARR_DST_ROOT="/my/HD/TV" \
-e SONARR_SRC_HOST=http://localhost:8989 \
-e SONARR_DST_HOST=http://localhost:8990 \
-e RADARR_SRC_APIKEY=apikey \
-e RADARR_DST_APIKEY=apikey \
-e RADARR_SRC_ROOT="/my/UHD/movies" \
-e RADARR_DST_ROOT="/my/HD/movies" \
-e RADARR_SRC_HOST=http://localhost:7878 \
-e RADARR_DST_HOST=http://localhost:7879 \
--restart unless-stopped \
arr-sync:latest
```

## Running

### Node.js

```
PORT=3000 \
SONARR_SRC_APIKEY=apikey \
SONARR_DST_APIKEY=apikey \
SONARR_SRC_ROOT="/my/UHD/TV" \
SONARR_DST_ROOT="/my/HD/TV" \
SONARR_SRC_HOST=http://localhost:8989 \
SONARR_DST_HOST=http://localhost:8990 \
RADARR_SRC_APIKEY=apikey \
RADARR_DST_APIKEY=apikey \
RADARR_SRC_ROOT="/my/UHD/movies" \
RADARR_DST_ROOT="/my/HD/movies" \
RADARR_SRC_HOST=http://localhost:7878 \
RADARR_DST_HOST=http://localhost:7879 \
npm start
```

### Docker

```
docker start arr-sync
```
