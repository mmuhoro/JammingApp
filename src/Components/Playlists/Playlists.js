import React, { Component } from 'react';
import './Playlists.css';

class Playlist extends Component {

  constructor(props) {
    super(props);

    this.edit = this.edit.bind(this);
  }

  edit(event) {
    this.props.onEditClick(event.target.id, event.target.name);
  }

  render() {
    if (this.props.isLoading) {
      return(
        <div className="Playlists">
          <p>Loading...</p>
        </div>
      );
    } else {
      return(
        <div className="Playlists">
          <h2>My Playlists</h2>

        {
          this.props.playlists.map(playlist => {
            return <h3 key={playlist.id}>{playlist.name} <a className="playlist-action" onClick={this.edit} id={playlist.id} name={playlist.name}>Edit</a></h3>
          })
        }
        </div>
      );
    }
  }
}

export default Playlist;
