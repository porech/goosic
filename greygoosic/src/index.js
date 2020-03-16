import React from "react";
import ReactDOM from "react-dom";
import SearchBar from "./components/searchbar";
class App extends React.Component {
  constructor() {
    super();
    this.state = { search: "" };
  }

  searchCallback = search => {
    this.setState({ search });
  };
  render() {
    return (
      <div>
        <SearchBar onSearch={this.searchCallback}></SearchBar>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));

export default App;
