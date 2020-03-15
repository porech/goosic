import React from "react";
import "./searchbar.css";
class SearchBar extends React.Component {
  render() {
    return (
      <div
        className={
          this.state && this.state.clicked
            ? "searchpane searchpane-clicked"
            : "searchpane"
        }
      >
        <i aria-hidden="true" className="search icon search-icon"></i>
        <input
          type="text"
          onClick={() => {
            this.setState({
              clicked: true
            });
          }}
          className="searchbar"
          placeholder={this.props.label || "Search here..."}
          onChange={event => {
            this.props.onSearch(event.target.value);
          }}
        />
      </div>
    );
  }
}
/*
 <div id="searchbar" className="ui icon input">
          */
export default SearchBar;
