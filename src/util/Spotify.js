
const Spotify = {
  userAccessToken : '',
  userAccessTokenExpirey : 0,

  clientID : '1c2f8c17144c4b338674c05fa3b02d87',
  // clientSecret : '838c2b25766a42a9848474b2095a9ac1',
  redirectURI : 'http://mmjamming.surge.sh/', //'http://localhost:3000/',

  getAccessToken() {

    // Token set, just return that
    if(this.userAccessToken) {
      return this.userAccessToken;
    }

    // No Token See if one is set in url
    let access_token = window.location.href.match('access_token=([^&]*)');
    if(access_token) {
      this.userAccessToken = access_token[1];
      let expires_in = window.location.href.match('expires_in=([^&]*)');
      if(expires_in) {
        this.userAccessTokenExpirey = +expires_in[1];
      }
      window.setTimeout(() => {
        this.userAccessToken = '';
      }, this.userAccessTokenExpirey * 1000);

      // Clean up url
      window.history.pushState('Access Token', null, '/');

      return this.userAccessToken;
    }

    // No Token set in url generate one
    let url = 'https://accounts.spotify.com/authorize';
    url += '?client_id=' + this.clientID + '&response_type=token&';
    url += 'scope=playlist-modify-public&redirect_uri=' + this.redirectURI;

    window.location = url;
  },

  async search(searchTerm) {

    // Get access token before user's 1st search
    if (!this.userAccessToken) {
      this.getAccessToken();
    }

    let url = 'https://api.spotify.com/v1/search?type=track&q=' + searchTerm;
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.userAccessToken}`}
    });

    let tracks = [];
    if (response && response.ok) {
      let jsonResponse = await response.json();
      if (jsonResponse.tracks.items.length > 0) {
        // console.log(jsonResponse.tracks.items[0]);
        tracks.push(
          jsonResponse.tracks.items.map(item => {
            let track = {
              id: item.id,
              name: item.name,
              artist: item.artists[0].name,
              album: item.album.name,
              uri: item.uri
            };
            return track;
          })
        );
      }
    } else {
      throw new Error('Search Playlist: response.nok');
    }
    return tracks[0];
  },

  async savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) return;

    if (!this.userAccessToken) {
      this.getAccessToken();
    }

    // Get userID
    let userID = '';
    let url = 'https://api.spotify.com/v1/me';
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.userAccessToken}`}
    });
    if (response && response.ok) {
      let jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.id) {
        userID = jsonResponse.id;
      } else {
        throw new Error('No Id');
      }
    } else {
      throw new Error('Get User ID: response.nok');
    }

    // Create Playlist
    let playlistID = '';
    url = `https://api.spotify.com/v1/users/${userID}/playlists`;
    response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ name: playlistName }),
      headers: {
        'Authorization': `Bearer ${this.userAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response && response.ok) {
      let jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.id) {
        playlistID = jsonResponse.id;
      } else {
        throw new Error('No Playlist ID');
      }
    } else {
      throw new Error('Create playlist: response.nok');
    }

    // Save trackURIs to playlists
    url = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
    response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ uris: trackURIs }),
      headers: {
        'Authorization': `Bearer ${this.userAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response && response.ok) {
      let jsonResponse = await response.json();
      if (jsonResponse) {
      } else {
        throw new Error('Failed to Save URIs');
      }
    } else {
      throw new Error('Create playlist: response.nok');
    }
  }
}

export default Spotify;
