let userAccessToken = '';
let userAccessTokenExpirey = 0;

const clientID = '1c2f8c17144c4b338674c05fa3b02d87';
// const clientSecret = '838c2b25766a42a9848474b2095a9ac1';
const redirectURI = 'http://localhost:3000/';
let userID = '';
let playlistID = '';

const Spotify = {

  getAccessToken() {

    // Token set, just return that
    if(userAccessToken) {
      return userAccessToken;
    }

    // No Token See if one is set in url
    let access_token = window.location.href.match('access_token=([^&]*)');
    if(access_token) {
      userAccessToken = access_token[1];
      let expires_in = window.location.href.match('expires_in=([^&]*)');
      if(expires_in) {
        userAccessTokenExpirey = +expires_in[1];
      }
      window.setTimeout(() => {
        userAccessToken = '';
      }, userAccessTokenExpirey * 1000);

      // Clean up url
      window.history.pushState('Access Token', null, '/');

      return userAccessToken;
    }

    // No Token set in url generate one
    let url = 'https://accounts.spotify.com/authorize';
    url += '?client_id=' + clientID + '&response_type=token&';
    url += 'scope=playlist-modify-public&redirect_uri=' + redirectURI;

    window.location = url;
  },

  async search(searchTerm) {

    let url = 'https://api.spotify.com/v1/search?type=track&q=' + searchTerm;
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${userAccessToken}`}
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

  async getUserId() {
    let url = 'https://api.spotify.com/v1/me';
    let response = fetch(url, {
      headers: { 'Authorization': `Bearer ${userAccessToken}`}
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
    return userID;
  },

  async getPlayList() {

  }

  async createPlayList(playlistName) {
    let thisPlaylistID = '';



    return thisPlaylistID;
  }

  async savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) return;

    // Get userID
    userID = this.getUserId();

    // Create Playlist
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`;
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ name: playlistName }),
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
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
        'Authorization': `Bearer ${userAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response && response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      if (jsonResponse) {
      } else {
        throw new Error('Failed to Save URIs');
      }
    } else {
      throw new Error('Create playlist: response.nok');
    }
  },

  async getPlayLists() {
    let userID = this.getUserId().then(user => user);
    console.log(userID.then(user => user));
    return;
    let url = `https://api.spotify.com/v1/users/${userID.then(user => {
      return user;
    })}/playlists`;
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${userAccessToken}`}
    });
    if (response && response.ok) {
      let jsonResponse = await response.json();
      console.log(jsonResponse);
      // if (jsonResponse && jsonResponse.id) {
      //   userID = jsonResponse.id;
      // } else {
      //   throw new Error('No Id');
      // }
    } else {
      throw new Error('Get User playlists: response.nok');
    }
  }
}

export default Spotify;
