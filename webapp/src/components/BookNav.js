import React from "react";
import BookList from "./BookList";
import "./BookNav.css"

import {postBookRequired, postBookOwned, getBooks} from "../utils/apiUtils";

export default class BookNav extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      hasMatches: false,
      currentTab: 0,
      currentAddedBook: ''
    };
    this.getMySearches = this.getMySearches.bind(this)
    this.getMyMatches = this.getMyMatches.bind(this)
    this.getMyPostings = this.getMyPostings.bind(this)
    this.sendBook = this.sendBook.bind(this)
  }

// Usable ISBN examples: 0131175327 0385333846 978-0132350884

  getMySearches() {
    // console.log(this.state);
    getBooks(window.email).then(books => {
      this.setState({
        currentTab: 0,
        data: books.books_required
      });
   });
    // // TODO: use util function to request my ISBNs from the server
    // let response = ["0131175327", "0385333846", "978-0132350884", "0984782869"];
    // this.setState({
    //   currentTab: 0,
    //   data: response
    // });
  }

  getMyPostings() {
     getBooks(window.email).then(books => {
         this.setState({
           currentTab: 1,
           data: books.books_owned
         });
     });

      // TODO: use util function to request my ISBNs from the server
      // let response = ["0385333846", "0131175327", "0984782869"];
      // this.setState({
      //   currentTab: 1,
      //   data: response
      // });
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

  sendBook() {
     if (this.state.currentTab === 0) {
        postBookRequired(window.email, this.state.currentAddedBook);
     } else {
        postBookOwned(window.email, this.state.currentAddedBook);
     }
  }

  render() {
    return (
      <div>
        <BookList
          isbnList={this.state.data}></BookList>
        <div className="newBook">
           <input
            name="ISBN"
            placeholder="ISBN"
            onChange={e => this.setState({currentAddedBook: e.target.value})}
           />
           <button onClick={this.sendBook}>new book</button>
        </div>
        <div className="booknav">
          <nav className="nav nav-pills nav-fill">
              <a className={"nav-item nav-link" + (this.state.currentTab === 0 ? " active" : "")}
                href="#"
                onClick={this.getMySearches}>My Searches</a>

              <a className={"nav-item nav-link" + (this.state.currentTab === 1 ? " active" : "") }
                href="#"
                onClick={this.getMyPostings}>My Textbooks</a>

              <a className={"nav-item nav-link" + (this.state.hasMatches ? "" : " disabled") + (this.state.currentTab === 2 ? " active" : "") }
                href="#"
                onClick={(this.state.hasMatches ?  this.getMyMatches : undefined)}>Matches</a>
          </nav>
        </div>
      </div>
    );
  }
}
