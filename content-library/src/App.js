import React, { Component } from 'react';
import './App.css';
import { data } from './books.json';
import BookRack from './components/BookRack';
import BookDetail from './components/BookDetail';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 'main'};
  }
  bookDetail = (currentBook) => {
    this.setState({currentBook});
  }
  close = (event) => {
    this.page = 'main';
  }
  render() {
    let page = this.state.page;
    return (
      <div className="App">
        {page === 'main' ? <BookRack books={data.books} detail={this.bookDetail} /> : null }
        {page === 'detail' ? <BookDetail book={this.state.currentBook} close={this.close} /> : null }
      </div>
    );
  }
}


export default App;
