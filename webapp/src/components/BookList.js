import React from 'react';
import './BookList.css'
import { getBookInformation } from '../utils/apiUtils'

export default class BookList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bookData: []
    };
  
  }

  componentWillReceiveProps() {
    var self = this;
    getBookInformation(this.props.isbnList).then(
      function(data){
        self.setState({
          bookData: Object.values(data)
        });
      }
    );
  }

  render() {
    console.log(this.props);   
    console.log(this.state);   
    if (typeof this.state.bookData === "undefined" || this.state.bookData.length == 0) {
      return (
        <div>
          <p>Add a book!</p>
        </div>
      )
    } else {        
      return (
        <div>
            <ul className="list-group">
            {
                this.state.bookData.map((item) => 
                    <div className="list-group-item bookitem">
                        <img className="img-rounded bookimage"
                             src={ typeof item.cover === "undefined" ? "https://www.honeystinger.com/c.3410322/sca-dev-elbrus/img/no_image_available.jpeg" : item.cover.medium}
                              alt={item.title} />
                        <div className="booktext">
                            <div className="booktitle">{item.title}</div>
                            <div className="bookauthors">
                                {
                                    typeof item.authors === "undefined" || item.authors.length === 0 ? "Author(s) unavailable" :
                                    item.authors.map((x)=>(x.name)).join(", ")
                                }
                            </div>
                        </div>
                    </div>)
            }
            </ul>
      </div>
      )}

  }
}