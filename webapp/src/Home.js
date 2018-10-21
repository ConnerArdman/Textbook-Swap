import React from "react";
import BookList from "./components/BookList";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <BookList title="Books you have" isbns={["0201558025", "9780262533058", "0345803485"]}></BookList>
    </div>
  );
};

export default Home;
