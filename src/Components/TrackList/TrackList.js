import React, { Component } from 'react';
import Track from '../Track/Track';
import './TrackList.css';

class TrackList extends Component {

  render() {
    let count = 1;
    if(this.props.tracks && this.props.tracks.length > 0)
      return(
        <div className="TrackList">
        {
          this.props.tracks.map(track => {
            return <Track track={track} key={track.id + count++} isRemoval={this.props.isRemoval} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
          })
        }
        </div>
      );
    else
      return(
        <div className="TrackList">
          <p>No Tracks</p>
        </div>
      );
  }
}

export default TrackList;
