
/**
 * getBookInformation - fetches https://openlibrary.org/api/
 *
 * @param  {number[]} isbns isbn numbers
 * @return {Object}
 */
function getBookInformation(isbns) {
   const apiEndpoint = 'https://openlibrary.org/api/books?bibkeys=';
   const apiExtraParams = '&format=json&jscmd=data'
   let isbnParam = '';
   isbns.forEach(isbn => {
      isbnParam += 'ISBN:' + isbn + ',';
   });
   return fetch(apiEndpoint + isbnParam + apiExtraParams).then(checkStatus).then(JSON.parse).catch(console.log);
}

function checkStatus(response) {
   if (response.status >= 200 && response.status < 300) {
      return response.text();
   } else {
      return Promise.reject(new Error(response.status+": "+response.statusText));
   }
}
