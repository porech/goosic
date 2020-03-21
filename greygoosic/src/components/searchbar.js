import React from "react";
import "./Searchbar.css";
import { connect } from "react-redux";
import { search, expandCollapseSearchBar } from "../actions";
class SearchBar extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.searchbarStatus.status === "expand"
            ? "searchpane searchpane-clicked"
            : "searchpane"
        }
      >
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
    this.props.expandCollapseSearchBar({
      status: "expand"
    });
  };
  onblur = () => {
    if (this.props.searchedText === "") {
      this.props.expandCollapseSearchBar({
        status: "collapse"
      });
    } else {
      console.log(this.props.searchedText);
    }
  };
}
const mapStateToProps = state => {
  return {
    searchedText: state.searchedText,
    label: state.label,
    searchbarStatus: state.searchbarStatus
  };
};
export default connect(mapStateToProps, { search, expandCollapseSearchBar })(
  SearchBar
);
