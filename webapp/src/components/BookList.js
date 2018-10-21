import React from 'react';
import styles from './BookList.css'
import { getBookInformation } from '../utils/apiUtils'

export default class BookList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bookData: [],
      isbns: props.isbns
    };
  
  }

  componentWillMount() {
    var self = this;
    getBookInformation(this.state.isbns).then(
      function(data){
        self.setState({
          bookData: Object.values(data)
        });
      }
    );
  }



  render() {   
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
            <div className={styles.listtitle}>{this.props.title}</div>
            <div>
            {
                this.state.bookData.map((item) => 
                    <div style={styles.bookitem}>
                        <img className={styles.bookimage} src={item.cover.medium} />
                        <div style={styles.booktext}>
                            <div style={styles.booktitle}>{item.title}</div>
                            <div style={styles.bookauthors}>
                                {
                                    typeof item.authors === "undefined" || item.authors.length === 0 ? "Author(s) unavailable" :
                                    item.authors.map((x)=>(x.name)).join(", ")
                                }
                            </div>
                        </div>
                    </div>)
            }
            </div>
      </div>
      )}

  }
}