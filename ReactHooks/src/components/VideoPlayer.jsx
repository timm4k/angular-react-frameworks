import { useRef } from "react";
import styles from "../styles/Task.module.css";

const videoUrl = "https://assets.mixkit.co/videos/47499/47499-720.mp4";

function VideoPlayer() {
  const videoRef = useRef(null);

  const play = () => videoRef.current?.play();
  const pause = () => videoRef.current?.pause();

  return (
    <article className={styles.card}>
      <span className={styles.number}>2.1</span>
      <p className={styles.eyebrow}>Live session</p>
      <h3>After-hours screening</h3>
      <video
        ref={videoRef}
        className={styles.video}
        src={videoUrl}
        preload="metadata"
        loop
        muted
        playsInline
        aria-label="Vinyl record playing on a turntable"
      />
      <div className={styles.actions}>
        <button onClick={play}>▶ Play</button>
        <button className={styles.secondary} onClick={pause}>
          Ⅱ Pause
        </button>
      </div>
    </article>
  );
}

export default VideoPlayer;
