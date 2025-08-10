# YouTube Live Tracker

A Google Apps Script that automatically discovers and logs live streams from multiple YouTube channels to Google Sheets, with optional playlist integration.

## What It's For

This tool helps you:

- Monitor multiple YouTube channels for live streams simultaneously
- Automatically log discovered live streams to organized spreadsheets
- Build playlists of live content from your favorite channels
- Keep a historical record of all live streams from tracked channels
- Never miss a live stream from channels you follow

## How It Works

The script operates by:

1. **Reading** a list of YouTube channel IDs from a main "Channels" sheet
2. **Searching** each channel for currently live videos using YouTube Data API
3. **Creating** a dedicated sheet for each channel (named after the channel)
4. **Logging** new live streams with video ID, title, URL, and timestamp
5. **Adding** videos to specified playlists (optional per channel)
6. **Preventing** duplicate entries by checking existing logs

## Setup

### Prerequisites

- Google account with Google Sheets access
- YouTube Data API v3 enabled in Google Cloud Console
- Channel IDs of YouTube channels you want to track

### Installation

1. **Create the Spreadsheet Structure**

   ```
   - Create a new Google Sheet
   - Rename the first sheet to "Channels"
   - Add headers: Channel ID | Playlist ID (optional)
   - Add channel IDs you want to track (one per row)
   ```

2. **Add the Script**

   - Go to Extensions → Apps Script
   - Delete any default code
   - Paste the [`Code.gs`](Code.gs) content
   - Save the project with a name like "YouTube Live Tracker"

3. **Enable YouTube API**

   - In Apps Script editor, click Services (+)
   - Find and add "YouTube Data API v3"
   - Click OK to enable

4. **Set Up Automation**

   - In Apps Script, click Triggers (clock icon)
   - Add Trigger → Choose function: `trackAllChannels`
   - Select time-based trigger (e.g., every 10 minutes)
   - Save

5. **First Run**
   - Run `trackAllChannels()` manually once
   - Authorize the required permissions
   - Check that channel sheets are created

### Usage

Once configured:

- The script runs automatically at your set interval
- Each tracked channel gets its own sheet with live stream history
- New live streams are automatically logged with timestamps
- Optional: Videos are added to playlists if playlist IDs are provided

### Sheet Structure

**Channels Sheet (Main):**
| Channel ID | Playlist ID |
|------------|-------------|
| UCxxxxxx | PLxxxxxx |

**Individual Channel Sheets (Auto-created):**
| Video ID | Title | URL | Date Added |
|----------|-------|-----|------------|
| xxxxxxxxxxx | Stream Title | https://youtube.com/watch?v=xxx | 2024-01-15 10:30:00 |

## LICENSE

MIT License
