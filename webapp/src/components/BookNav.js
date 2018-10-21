import React from "react";
import BookList from "./BookList";
import "./BookNav.css"


export default class BookNav extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      hasMatches: false,
      currentTab: 0
    };
    this.getMySearches = this.getMySearches.bind(this)
    this.getMyMatches = this.getMyMatches.bind(this)
    this.getMyPostings = this.getMyPostings.bind(this)
  }

  getMySearches() {
    console.log(this.state);
    // TODO: use util function to request my ISBNs from the server
    let response = ["0131175327", "0385333846", "978-0132350884", "0984782869"];
    this.setState({
      currentTab: 0,
      data: response
    });
  }

  getMyPostings() {
      // TODO: use util function to request my ISBNs from the server
      let response = ["0385333846", "0131175327", "0984782869"];
      this.setState({
        currentTab: 1,
        data: response
      });
  
  }

  getMyMatches() {
    // TODO: use util function to request my ISBNs from the server
    let response = [];
    let hasMatches = false;
    if (response.length > 0) {
      hasMatches = true;
    }
    this.setState({
      currentTab: 2,
      data: response,
      hasMatches: hasMatches
    });
  }

  render() {   
    return (
      <div>
        <BookList
          isbnList={this.state.data}></BookList>
          <div className="booknav">
        <nav className="nav">
            <a className={"nav-link" + (this.state.currentTab === 0 ? " active" : "")}
              href="#"
              onClick={this.getMySearches}>My Searches</a>

            <a className={"nav-link" + (this.state.currentTab === 1 ? " active" : "") } 
              href="#"
              onClick={this.getMyPostings}>My Textbooks</a>

            <a className={"nav-link" + (this.state.hasMatches ? "" : " disabled") + (this.state.currentTab === 2 ? " active" : "") }
              href="#"
              onClick={(this.state.hasMatches ?  this.getMyMatches : undefined)}>Matches</a>
        </nav>
        </div>

      </div>
    );
  
  }
}