import SumTask from "./components/SumTask";
import FilterTask from "./components/FilterTask";
import FullNameTask from "./components/FullNameTask";
import SubmitTask from "./components/SubmitTask";
import PurchaseTask from "./components/PurchaseTask";
import ProfileTask from "./components/ProfileTask";
import PricingTask from "./components/PricingTask";
import Level from "./components/Level";
import styles from "./styles/App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <main id="top">
        <section className={styles.hero}>
          <span className={styles.kicker}>Escape unnecessary effects</span>
          <h1>
            One result
            <br />
            <em>fewer renders</em>
          </h1>
          <p>
            Compare effect-driven code with direct calculations, event handlers
            and component keys. Every example shows what to remove and why
          </p>
        </section>

        <Level number="01" label="Derived state" title="Remove redundant state">
          <SumTask />
          <FilterTask />
          <FullNameTask />
        </Level>

        <Level
          number="02"
          label="Events vs effects"
          title="Keep actions in handlers"
        >
          <SubmitTask />
          <PurchaseTask />
        </Level>

        <Level
          number="03"
          label="State reset"
          title="Reset and calculate deliberately"
        >
          <ProfileTask />
          <PricingTask />
        </Level>
      </main>
    </div>
  );
}

export default App;
