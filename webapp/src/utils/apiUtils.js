
/**
 * getBookInformation - fetches https://openlibrary.org/api/
 *
 * @param  {number[]} isbns isbn numbers
 * @return {Promise}
 */
export function getBookInformation(isbns) {
   const apiEndpoint = 'https://openlibrary.org/api/books?bibkeys=';
   const apiExtraParams = '&format=json&jscmd=data'
   let isbnParam = '';
   if (typeof isbns === "undefined") {
       isbns = [];
   }
   isbns.forEach(isbn => {
      isbnParam += 'ISBN:' + isbn + ',';
   });
   return fetch(apiEndpoint + isbnParam + apiExtraParams).then(checkStatus).then(JSON.parse).catch(console.log);
}

// Returns a promise of books JSON
// books_required: [book1, book2, etc]
// books_owned: [book1, book2, etc]
export function getBooks(email) {
   const url = 'http://localhost:3000/books?email=';
   return fetch(url + email, {
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
      }
   }).then(checkStatus).then(JSON.parse).catch(console.log);
}

export function postBookOwned(email, isbn) {
   postBook(email, isbn, 'book_owned');
}

export function postBookRequired(email, isbn) {
   postBook(email, isbn, 'book_required');
}

function postBook(email, isbn, endpoint) {
   const data = {
      email: email,
      isbn: isbn
   };

   const url = 'http://localhost:3000/' + endpoint;
   fetch(url, {
               method: "POST",
               body: JSON.stringify(data),
               headers: {
                  'Content-Type': 'application/json'
               }
            }).catch(console.log);
}

function checkStatus(response) {
   if (response.status >= 200 && response.status < 300) {
      return response.text();
   } else {
      return Promise.reject(new Error(response.status+": "+response.statusText));
   }
}
