import React from "react";
import TextField from "@material-ui/core/TextField";
import "./searchbar.css";
class SearchBar extends React.Component {
  render() {
    return (
      <TextField
        id="searchbar"
        label={this.props.label || "Search here..."}
        onChange={event => {
          this.props.onSearch(event.target.value);
        }}
      />
    );
  }
}

export default SearchBar;
