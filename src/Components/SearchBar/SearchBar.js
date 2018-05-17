import React, { Component } from 'react';
import './SearchBar.css';
import './custom.js';

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.checkReturnKey   = this.checkReturnKey.bind(this);
  }

  componentDidMount() {
    // Check if searchTerm is saved and restore
    let searchTerm = localStorage.getItem('searchTerm');
    if(searchTerm) {
      // Restore searchTerm
      this.setState({searchTerm: searchTerm});
      // Set input.value
      document.getElementById("search-input").value = searchTerm;
      localStorage.removeItem('searchTerm');
    }
  }


  search() {
    this.props.onSearch(this.state.searchTerm);
  }

  handleTermChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  checkReturnKey(event) {
    if(event.which === 13) {
      this.search();
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input id="search-input" placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.checkReturnKey}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
