import React, {Component} from "react";
import BookCover from "./BookCover";

class BookRack extends Component {
  constructor(props) {
    super(props);
    this.state = { books: props.books};
  }
  addNewBook = () => {
    let books = this.state.books;
    books.unshift({
      id: Date.now(),
      title: 'New reading',
      src: '/logo1.png'
    });
    this.setState({books});
  }
  clickHandler = (event) => {
    console.log('Viewing book details');
    const card = event.target.closest('.item').className.split('-')[1];
    const currentBook = this.state.books[card - 1];
    this.props.detail(currentBook);
  };

  render() {
    return (
      <div className="book-rack">
      <button onClick={this.addNewBook}>
        Add Reading
      </button>
      <div className="grid" onClick={this.clickHandler}>
        {this.state.books.map((book, index) => (
          <BookCover
            index={index+1}
            title={book.title}
            author={book.author}
            src={book.src}
            id={book.id}
            key={book.id}
          />
        ))}
      </div>
      </div>
    )
  }
}

// class BookRack extends Component {
//   render() {
//     console.log(this.props.books);
//     return (
//       <div className="grid">
//         <div className="item item-1">
//           <BookCover
//             title="War and Peace"
//             author="Leo Tolstoy"
//             src="https://images-na.ssl-images-amazon.com/images/I/510UE7bvHoL._SX329_BO1,204,203,200_.jpg"
//           />
//         </div>
//         <div className="item item-2">
//           <BookCover
//             title="Huckleberry Finn"
//             author="Mark Twain"
//             src="https://t3.gstatic.com/images?q=tbn:ANd9GcTlt9xiIUoK482kv33_52nUhmXi7lIC1cyHOgmxTQLX9YJtRMZZ"
//           />
//         </div>
//         <div className="item item-3">
//           <BookCover
//             title="War and Peace"
//             author="Leo Tolstoy"
//             src="https://images-na.ssl-images-amazon.com/images/I/510UE7bvHoL._SX329_BO1,204,203,200_.jpg"
//           />
//         </div>
//         <div className="item item-4">
//           <BookCover
//             title="Huckleberry Finn"
//             author="Mark Twain"
//             src="https://t3.gstatic.com/images?q=tbn:ANd9GcTlt9xiIUoK482kv33_52nUhmXi7lIC1cyHOgmxTQLX9YJtRMZZ"
//           />
//         </div>
//         <div className="item item-5">
//           <BookCover
//             title="War and Peace"
//             author="Leo Tolstoy"
//             src="https://images-na.ssl-images-amazon.com/images/I/510UE7bvHoL._SX329_BO1,204,203,200_.jpg"
//           />
//         </div>
//         <div className="item item-6">
//           <BookCover
//             title="Huckleberry Finn"
//             author="Mark Twain"
//             src="https://t3.gstatic.com/images?q=tbn:ANd9GcTlt9xiIUoK482kv33_52nUhmXi7lIC1cyHOgmxTQLX9YJtRMZZ"
//           />
//         </div>
//         <div className="item item-7">
//           <BookCover
//             title="War and Peace"
//             author="Leo Tolstoy"
//             src="https://images-na.ssl-images-amazon.com/images/I/510UE7bvHoL._SX329_BO1,204,203,200_.jpg"
//           />
//         </div>
//         <div className="item item-8">
//           <BookCover
//             title="Huckleberry Finn"
//             author="Mark Twain"
//             src="https://t3.gstatic.com/images?q=tbn:ANd9GcTlt9xiIUoK482kv33_52nUhmXi7lIC1cyHOgmxTQLX9YJtRMZZ"
//           />
//         </div>
//       </div>
//     )
//   }
// };

export default BookRack;
