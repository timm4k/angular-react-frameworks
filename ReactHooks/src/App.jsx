import { useState } from "react";
import LoginPanel from "./components/LoginPanel";
import ReactionCounter from "./components/ReactionCounter";
import SilentCounter from "./components/SilentCounter";
import VideoPlayer from "./components/VideoPlayer";
import ColorBox from "./components/ColorBox";
import PreviousCounter from "./components/PreviousCounter";
import MessageFeed from "./components/MessageFeed";
import TimerPanel from "./components/TimerPanel";
import OutsideModal from "./components/OutsideModal";
import styles from "./styles/App.module.css";

const colors = [
  { name: "Plum", value: "#765985" },
  { name: "Mauve", value: "#96718f" },
  { name: "Lavender", value: "#8a79a8" },
];

function App() {
  const [color, setColor] = useState(colors[0].value);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#top"
          aria-label="Vinyl After Dark home"
        >
          <span className={styles.record}>
            <i />
          </span>
          <span>
            VINYL
            <br />
            AFTER DARK
          </span>
        </a>
      </header>

      <main id="top">
        <section className={styles.hero}>
          <div>
            <span className={styles.kicker}>Tonight at Needle & Groove</span>
            <h1>
              Records sound better
              <br />
              <em>after midnight</em>
            </h1>
            <p>
              A hands-on React hooks collection hidden inside an independent
              record store
            </p>
          </div>
          <div className={styles.heroVinyl} aria-hidden="true">
            <i />
          </div>
        </section>

        <section className={styles.level}>
          <div className={styles.levelTitle}>
            <span>01</span>
            <div>
              <p>The Observer</p>
              <h2>Front counter</h2>
            </div>
          </div>
          <div className={styles.grid}>
            <LoginPanel />
            <ReactionCounter />
            <SilentCounter />
          </div>
        </section>

        <section className={styles.level}>
          <div className={styles.levelTitle}>
            <span>02</span>
            <div>
              <p>The Operator</p>
              <h2>Listening room</h2>
            </div>
          </div>
          <div className={styles.grid}>
            <VideoPlayer />
            <ColorBox color={color}>
              <div className={styles.swatches}>
                {colors.map((item) => (
                  <button
                    key={item.name}
                    className={
                      color === item.value ? styles.swatchActive : styles.swatch
                    }
                    style={{ "--swatch": item.value }}
                    onClick={() => setColor(item.value)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </ColorBox>
            <PreviousCounter />
          </div>
        </section>

        <section className={styles.level}>
          <div className={styles.levelTitle}>
            <span>03</span>
            <div>
              <p>UI Engineer</p>
              <h2>Closing shift</h2>
            </div>
          </div>
          <div className={styles.grid}>
            <MessageFeed />
            <TimerPanel />
            <OutsideModal />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
