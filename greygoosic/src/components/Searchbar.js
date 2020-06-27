import React from "react";
import "./Searchbar.css";
import { connect } from "react-redux";
import { search } from "../actions";
class SearchBar extends React.Component {
  render() {
    return (
      <div
        className="searchpane"
        onClick={() => {
          document.querySelector("#search").focus();
        }}
      >
        <i aria-hidden="true" className="search icon search-icon"></i>
        <input
          id="search"
          key="search"
          type="search"
          className="searchbar"
          autoComplete="off"
          placeholder={this.props.label || "Search here..."}
          onChange={event => {
            this.props.search(event.target.value);
          }}
        />
      </div>
    );
  }

  /*   onfocus = () => {
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
  };*/
}
const mapStateToProps = state => {
  return {
    searchedText: state.searchedText,
    label: state.label
  };
};
export default connect(mapStateToProps, { search })(SearchBar);
