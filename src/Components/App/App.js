import React, { Component } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: [],
      playlistID: ''
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.setSearchTerm = this.setSearchTerm.bind(this);
  }

  setSearchTerm(searchTerm) {
    this.setState({searchTerm: searchTerm});
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks ? this.state.playlistTracks : [];
    if(tracks && tracks.find(mTrack => mTrack.id===track.id)) {
      return
    };
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    // console.log(track);return;
    let playlistTracks = this.state.playlistTracks;
    playlistTracks = playlistTracks.filter(mTrack => mTrack.key !== track.key);
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
    try {
      Spotify.savePlaylist(this.state.playlistName, trackURIs[0], this.state.playlistID);
    } catch (e) { }
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlistID: ''
    });
    localStorage.removeItem('playlists');
  }

  search(searchTerm) {
    if(!searchTerm) {
      alert('Please enter a search term!');
      return;
    }
    let results = [];
    try {
      results = Spotify.search(searchTerm);
    } catch (e) {  }
    results.then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  onEditClick(id, name) {
    let results = Spotify.getPlayListTracks(id);
    results.then(tracks => {
      this.setState({
        playlistName: name,
        playlistTracks: tracks,
        playlistID: id
      });
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onEditClick={this.onEditClick}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
