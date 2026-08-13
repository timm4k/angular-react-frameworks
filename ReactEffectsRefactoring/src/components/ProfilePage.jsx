import { useState } from "react";
import styles from "../styles/Demo.module.css";

function ProfilePage({ artist }) {
  const [comment, setComment] = useState("");

  return (
    <label className={styles.profileComment}>
      Private note for {artist.name}
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Write a note, then switch artist"
      />
    </label>
  );
}

export default ProfilePage;
