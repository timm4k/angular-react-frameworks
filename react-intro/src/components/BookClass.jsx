import React, { Component } from "react";
import bookImg from "../assets/images/book.jpg";

class BookClass extends Component {
  state = {
    title: "A Madman's Defence",
    published: 1887,
    genre: "Psychological Novel / Autobiographical Fiction",
    pages: 300,
    description:
      "A Madman's Defence is a deeply personal and psychological novel by August Strindberg. The narrative portrays emotional collapse within a troubled marriage",
    atmosphere:
      "The book presents love as both passionate and destructive, creating an intense psychological atmosphere filled with paranoia, obsession, and inner conflict",
    reviews: [
      "A powerful study of jealousy and emotional instability",
      "Raw, intimate, and psychologically unsettling",
      "One of Strindberg's most controversial works",
    ],
  };

  render() {
    const { title, published, genre, pages, description, atmosphere, reviews } =
      this.state;

    return (
      <article>
        <h1>{title}</h1>

        <div className="book-layout">
          <div className="book-side">
            <img src={bookImg} alt="A Madman's Defence cover" />
          </div>

          <div className="book-side">
            <p>
              <strong>Published:</strong> {published}
            </p>
            <p>
              <strong>Genre:</strong> {genre}
            </p>
            <p>
              <strong>Pages:</strong> {pages}
            </p>
            <p>{description}</p>
            <p>{atmosphere}</p>
          </div>
        </div>

        <h3>Reviews:</h3>
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>"{review}"</li>
          ))}
        </ul>
      </article>
    );
  }
}

export default BookClass;
