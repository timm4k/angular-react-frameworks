import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import ProfilePage from "./ProfilePage";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

const artists = [
  { id: "keifer", name: "Tom Keifer" },
  { id: "brittingham", name: "Eric Brittingham" },
  { id: "labar", name: "Jeff LaBar" },
  { id: "coury", name: "Fred Coury" },
];

function ProfileTask() {
  const [artistId, setArtistId] = useState(artists[0].id);
  const artist = artists.find((item) => item.id === artistId);

  return (
    <ComparisonCard
      number="3.1"
      title="Profile reset"
      badCode={snippets.profile.bad}
      goodCode={snippets.profile.good}
      problem="The component first renders the new profile with the previous user’s comment, then the effect clears it in another render"
      solution="key tells React that a different artist is a different component instance. The old state is discarded immediately and naturally"
      badFlow={["Switch user", "Show old note", "Effect", "Clear note"]}
      goodFlow={["Switch user", "New key", "Fresh component"]}
    >
      <div className={styles.segmented} aria-label="Choose artist">
        {artists.map((item) => (
          <button
            key={item.id}
            className={artistId === item.id ? styles.selected : ""}
            onClick={() => setArtistId(item.id)}
          >
            {item.name.split(" ")[0]}
          </button>
        ))}
      </div>
      <ProfilePage key={artistId} artist={artist} />
    </ComparisonCard>
  );
}

export default ProfileTask;
