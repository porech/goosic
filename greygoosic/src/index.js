import React from "react";
import ReactDOM from "react-dom";
import SearchBar from "./components/searchbar";
import SongList from "./components/songlist";
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
        <SearchBar state={this.state} onSearch={this.searchCallback} />
        <SongList></SongList>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));

export default App;
