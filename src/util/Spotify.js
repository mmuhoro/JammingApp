
const Spotify = {
  userAccessToken : '',
  userAccessTokenExpirey : 0,//1e6,

  clientID : '1c2f8c17144c4b338674c05fa3b02d87',
  // clientSecret : '838c2b25766a42a9848474b2095a9ac1',
  // redirectURI : 'http://essyjamming.surge.sh/',
  redirectURI : 'http://localhost:3000/',

  userID : '',

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

  async getUserId() {
    // Get userID
    if(this.userID) {
      return this.userID;
    }
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
    this.userID = userID;
    return await this.userID;
  },

  async search(searchTerm = '') {

    // Get access token before user's 1st search
    if (!this.userAccessToken) {
      // setItem just in case redirect
      localStorage.setItem('searchTerm', searchTerm);
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
        let key = 0;
        tracks.push(
          jsonResponse.tracks.items.map(item => {
            let track = {
              id: item.id,
              key: key++,
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

  async savePlaylist(playlistName, trackURIs, playlistID = '') {
    if(!playlistName || !trackURIs) return;

    if (!this.userAccessToken) {
      // Save Session
      this.getAccessToken();
      // Get Session if no redirect
    }

    // Get userID
    if(!this.userID) {
      await this.getUserId();
    }

    if (!playlistID) {
      // Create Playlist
      let url = `https://api.spotify.com/v1/users/${this.userID}/playlists`;
      let response = await fetch(url, {
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
    }

    // console.log(playlistID);return;

    // Save trackURIs to playlists
    let url = `https://api.spotify.com/v1/users/${this.userID}/playlists/${playlistID}/tracks`;
    let response = await fetch(url, {
      method: !playlistID ? 'POST' : 'PUT',
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
  },

  async getPlayLists() {
    if (!this.userAccessToken) {
      // Save Session
      this.getAccessToken();
      // Get Session if no redirect
    }

    // Get userID
    if(!this.userID) {
      await this.getUserId();
    }

    // Get playlists
    let playlists = [];
    let url = `https://api.spotify.com/v1/users/${this.userID}/playlists`;
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.userAccessToken}`}
    });
    if (response && response.ok) {
      let jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.items) {
        playlists.push(
          jsonResponse.items.map(item => {
            let playlist = {
              id : item.id,
              name : item.name
            };
            return playlist;
          })
        );
      }
    } else {
      throw new Error('Get User playlists: response.nok');
    }
    return await playlists[0];
  },

  async getPlayListTracks(id) {
    if (!this.userAccessToken) {
      // Save Session
      this.getAccessToken();
      // Get Session if no redirect
    }

    // Get userID
    if(!this.userID) {
      await this.getUserId();
    }

    // Get playlists
    let url = `https://api.spotify.com/v1/users/${this.userID}/playlists/${id}/tracks`;
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.userAccessToken}`}
    });

    let tracks = [];
    if (response && response.ok) {
      let jsonResponse = await response.json();
      if (jsonResponse.items.length > 0) {
        let key = 0;
        tracks.push(
          jsonResponse.items.map(item => {
            let track = {
              id: item.track.id,
              key: key++,
              name: item.track.name,
              artist: item.track.artists[0].name,
              album: item.track.album.name,
              uri: item.track.uri
            };
            return track;
          })
        );
      }
    } else {
      throw new Error('Search Playlist: response.nok');
    }
    return tracks[0];
  }
}

export default Spotify;
