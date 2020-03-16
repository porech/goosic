import React from "react";
import "./searchbar.css";
class SearchBar extends React.Component {
  render() {
    return (
      <div className={this.getClasses()}>
        <i aria-hidden="true" className="search icon search-icon"></i>
        <input
          type="text"
          className="searchbar"
          placeholder={this.props.label || "Search here..."}
          onChange={event => {
            this.props.onSearch(event.target.value);
          }}
        />
      </div>
    );
  }

  getClasses() {
    return "searchpane searchpane-clicked";
    /* } else {
      return "searchpane";
    } */
  }
}
/*
 <div id="searchbar" className="ui icon input">
          */
export default SearchBar;
