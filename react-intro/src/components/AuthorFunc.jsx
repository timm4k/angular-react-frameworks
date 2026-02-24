import React from "react";
import authorImg from "../assets/images/August_Strindberg.jpg";

const AuthorFunc = () => {
  const author = {
    name: "August Strindberg",
    born: "1849",
    died: "1912",
    nationality: "Swedish",
    description:
      "August Strindberg was one of the most influential Swedish writers and playwrights of the late 19th century. He significantly shaped modern European drama and psychological prose",
    legacy:
      "His works explore emotional instability, jealousy, love, identity, and mental conflict. Strindberg's writing is intense, autobiographical, and psychologically profound",
  };

  return (
    <article>
      <h1>{author.name}</h1>

      <div className="book-layout">
        <div className="book-side">
          <img src={authorImg} alt="August Strindberg" />
        </div>

        <div className="book-side">
          <p>
            <strong>Born:</strong> {author.born}
          </p>
          <p>
            <strong>Died:</strong> {author.died}
          </p>
          <p>
            <strong>Nationality:</strong> {author.nationality}
          </p>
          <p>{author.description}</p>
          <p>{author.legacy}</p>
        </div>
      </div>
    </article>
  );
};

export default AuthorFunc;
