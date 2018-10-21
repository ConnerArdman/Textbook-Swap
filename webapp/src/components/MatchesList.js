import React from 'react';
import './BookList.css'
import { getMatches, getBookInformation } from '../utils/apiUtils'

export default class MatchesList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      matches: []
    };
  }

  componentDidMount() {
    const self = this;
    getMatches(window.email).then(data => {
      return data.notifications[0].map(match => {
         return {
            email: match.email,
            item: getBookInformation(match.books)
         }
      });
   }).then(
      function(data){
        self.setState({
          matches: data
        });
      }
    );
    console.log(this.state.matches);
  }

  // componentWillReceiveProps(props) {
  //   var self = this;
  //   getBookInformation(props.isbnList).then(
  //     function(data){
  //       self.setState({
  //         bookData: Object.values(data)
  //       });
  //     }
  //   );
  // }

  render() {
     return <div>
       <p>No matches found. Please Check back later!</p>
     </div>;
    console.log(this.props);
    console.log(this.state);
    if (typeof this.state.matches === "undefined" || this.state.matches.length === 0) {
      return (
        <div>
          <p>No matches found. Please Check back later!</p>
        </div>
      )
    } else {
      return (
        <div>
            <ul className="list-group">
            {
                this.state.matches.map((match, index) => {
                     let out = "";
                     match.item.then(async item => {
                        out = <div className="list-group-item bookitem" key={index}>
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
                         </div>
                     })
                     return out;
                })
            }
            </ul>
      </div>
      )}

  }
}
