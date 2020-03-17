import React from "react";
import "./searchbar.css";
class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = { classes: "searchpane", search: "" };
  }
  render() {
    return (
      <div className={this.state.classes}>
        <i aria-hidden="true" className="search icon search-icon"></i>
        <input
          type="text"
          onFocus={this.onfocus}
          onBlur={this.onblur}
          className="searchbar"
          placeholder={this.props.label || "Search here..."}
          onChange={event => {
            this.setState({ search: event.target.value });
            this.props.onSearch(event.target.value);
          }}
        />
      </div>
    );
  }
  onfocus = () => {
    this.setState({ classes: "searchpane searchpane-clicked" });
  };
  onblur = () => {
    if (this.state.search === "") {
      this.setState({ classes: "searchpane" });
    }
  };
}

export default SearchBar;
