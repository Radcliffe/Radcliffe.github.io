import React, {Component} from "react";

class BookCover extends Component {

  render() {
    const itemclass = "item item-" + this.props.index;

    return (
      <div className={itemclass} >
        <div className="card">
          <img className="card-img-top" src={this.props.src} alt={this.props.title} height="150" />
          <div className="text">
            <h4 className="card-title"> {this.props.title} </h4>
            <p className="card-text"> {this.props.author} </p>
          </div>
        </div>
      </div>
    )
  }
}

export default BookCover;
