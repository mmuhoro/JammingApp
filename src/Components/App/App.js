import React, { Component } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    Spotify.getAccessToken();

    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(mTrack => mTrack.id===track.id)) {
      return
    };
    this.state.playlistTracks.push(track);
    this.setState({playlistTracks: this.state.playlistTracks});
  }

  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    playlistTracks = playlistTracks.filter(mTrack => mTrack.id !== track.id);
    this.setState({playlistTracks: playlistTracks});
  }

  updatePlaylistName(myPlaylistName) {
    this.setState({playlistName: myPlaylistName});
  }

  savePlaylist() {
    let trackURIs = [];
    trackURIs.push(
      this.state.playlistTracks.map(track => {
        return track.uri;
      })
    );
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist'});
    this.setState({playlistTracks: []});
  }

  search(searchTerm) {
    let results = Spotify.search(searchTerm);
    // console.log(results);
    this.setState({searchResults: results});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
