import React, { Component } from 'react';

import TrackList from '../TrackList/TrackList';
import Playlists from '../Playlists/Playlists';
import Spotify from '../../util/Spotify';

import './Playlist.css';

class Playlist extends Component {


  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      playlists: []
    }

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount() {
    // Check for playlist in storage
    let playlists = JSON.parse(localStorage.getItem('playlists'));
    if(playlists) {
      this.setState({ playlists: playlists, isLoading: false });
      return;
    }

    // Get Playlists from API
    playlists = Spotify.getPlayLists();
    playlists.then(plylsts => {
      // Save playlists to storage
      localStorage.setItem('playlists', JSON.stringify(plylsts));
      this.setState({ playlists: plylsts, isLoading: false });
    });
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
        <Playlists playlists={this.state.playlists} isLoading={this.state.isLoading} onEditClick={this.props.onEditClick}/>
      </div>
    );
  }
}

export default Playlist;
