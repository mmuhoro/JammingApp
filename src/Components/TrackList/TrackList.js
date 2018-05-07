import React, { Component } from 'react';
import Track from '../Track/Track';
import './TrackList.css';

class TrackList extends Component {

  render() {
    return(
      <div className="TrackList">
      {
        this.props.tracks.map(track => {
          return <Track track={track} key={track.id} isRemoval={this.props.isRemoval} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
        })
      }
      </div>
    );
  }
}

export default TrackList;
