import React, { Component } from 'react';

class BookDetail extends Component {
  constructor(props) {
    super(props);
    this._state = {};
  }
  save = (event) => {
    let book = this._state.book;
    book.title = document.getElementById('reading-title').value; 
  }
  render() {
    let book = this.props.book;
    this._state.book = book;
    if (book === undefined) return null;
    return (
      <div className="myForm">
      <h1>Reading Details</h1>
      <form action="#">
        <label htmlFor="reading-title">Title</label>
        <input type="text" id="reading-title" defaultValue={book.title} />

        <label htmlFor="lexile-average">Lexile average</label>
        <input type="text" id="lexile-average" defaultValue={book.lexileAverage} />

        <label htmlFor="casas-average">CASAS Average</label>
        <input type="text" id="casas-average" defaultValue={book.casasAverage} />

        <label htmlFor="goal-align">Goal Align</label>
        <input type="text" id="goal-align" defaultValue={book.goalAlign} />

        <label htmlFor="genre">Genre</label>
        <input type="text" id="genre" defaultValue={book.genre} />

        <label htmlFor="license">License</label>
        <input type="text" id="license" defaultValue={book.license} />

        <label htmlFor="license-expires">License Expires</label>
        <input type="text" id="license-expires" defaultValue={book.licenseExpires} />

        <label htmlFor="synopsis">Synopsis</label>
        <input type="text" id="synopsis" defaultValue={book.synopsis} />

        <label htmlFor="notes">Notes</label>
        <input type="text" id="notes" defaultValue={book.notes} />

        <label htmlFor="links">Links to resources</label>
        <input type="text" id="links" defaultValue={book.links} />

        <button type="submit" onClick={this.save}>Save</button>
      </form>
      </div>
    )
  }
}

export default BookDetail;
