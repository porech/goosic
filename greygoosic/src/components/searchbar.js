import React from "react";
import "./Searchbar.css";
import { connect } from "react-redux";
import { search } from "../actions";
class SearchBar extends React.Component {
  classes = "searchpane";
  render() {
    return (
      <div className={this.classes}>
        <i aria-hidden="true" className="search icon search-icon"></i>
        <input
          type="text"
          onFocus={this.onfocus}
          onBlur={this.onblur}
          className="searchbar"
          placeholder={this.props.label || "Search here..."}
          onChange={event => {
            this.props.search(event.target.value);
          }}
        />
      </div>
    );
  }

  onfocus = () => {
    this.classes = "searchpane searchpane-clicked";
  };
  onblur = () => {
    if (this.props.searchedText === "") {
      this.classes = "searchpane";
    } else {
      console.log(this.props.searchedText);
    }
  };
}
const mapStateToProps = state => {
  return { searchedText: state.searchedText, label: state.label };
};
export default connect(mapStateToProps, { search })(SearchBar);
