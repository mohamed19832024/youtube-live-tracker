function trackAllChannels() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName('Channels');
  if (!mainSheet) {
    throw new Error('Main sheet "Channels" not found.');
  }

  var rows = mainSheet.getDataRange().getValues();
  rows.shift(); // Remove header row

  rows.forEach(function (row) {
    var channelId = row[0];
    var playlistId = row[1] || ''; // Optional per channel

    if (!channelId) return;

    // Get channel title
    var channelInfo = YouTube.Channels.list('snippet', { id: channelId });
    if (!channelInfo.items || channelInfo.items.length === 0) {
      Logger.log('Channel not found: ' + channelId);
      return;
    }
    var channelTitle = channelInfo.items[0].snippet.title;
    var safeTitle = channelTitle.replace(/[\\\/\?\*\[\]]/g, '_'); // Sheet-safe name

    // Create or get the channel's dedicated sheet
    var channelSheet = ss.getSheetByName(safeTitle);
    if (!channelSheet) {
      channelSheet = ss.insertSheet(safeTitle);
      channelSheet.appendRow(['Video ID', 'Title', 'URL', 'Date Added']);
    }

    // Search for live videos
    var searchResponse = YouTube.Search.list('snippet', {
      channelId: channelId,
      eventType: 'live',
      type: 'video',
      maxResults: 5
    });

    if (!searchResponse.items || searchResponse.items.length === 0) {
      Logger.log('No livestreams for ' + channelTitle);
      return;
    }

    // Get logged IDs
    var lastRow = channelSheet.getLastRow();
    var loggedIds = lastRow > 1 ? channelSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat() : [];

    searchResponse.items.forEach(function (item) {
      var videoId = item.id.videoId;
      var title = item.snippet.title;
      var url = 'https://www.youtube.com/watch?v=' + videoId;

      if (loggedIds.indexOf(videoId) !== -1) {
        Logger.log('Already logged: ' + videoId);
        return;
      }

      // Add to playlist if provided
      if (playlistId) {
        YouTube.PlaylistItems.insert(
          {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: videoId
              }
            }
          },
          'snippet'
        );
      }

      // Log in channel sheet
      channelSheet.appendRow([videoId, title, url, new Date()]);
      Logger.log('Added livestream for ' + channelTitle + ': ' + title);
    });
  });
}
