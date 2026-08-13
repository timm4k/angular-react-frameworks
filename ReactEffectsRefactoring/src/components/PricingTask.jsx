import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

function PricingTask() {
  const [cardType, setCardType] = useState("gold");
  const discount = cardType === "gold" ? 20 : 0;
  const finalPrice = 100 - discount;

  return (
    <ComparisonCard
      number="3.2"
      title="Membership pricing"
      badCode={snippets.pricing.bad}
      goodCode={snippets.pricing.good}
      problem="Two effects create a chain: card type changes discount, then discount changes price. The UI passes through unnecessary intermediate renders"
      solution="Both values are pure calculations from cardType. React gets the complete price during one render with no chain reaction"
      badFlow={[
        "Change card",
        "Render",
        "Set discount",
        "Render",
        "Set price",
        "Render",
      ]}
      goodFlow={["Change card", "Calculate both", "Render"]}
    >
      <div className={styles.membership}>
        <label>
          Membership
          <select
            value={cardType}
            onChange={(event) => setCardType(event.target.value)}
          >
            <option value="gold">Gold collector</option>
            <option value="standard">Standard listener</option>
          </select>
        </label>
        <div className={styles.receipt}>
          <span>
            Base price <strong>$100</strong>
          </span>
          <span>
            Discount <strong>−${discount}</strong>
          </span>
          <span>
            Total <strong>${finalPrice}</strong>
          </span>
        </div>
      </div>
    </ComparisonCard>
  );
}

export default PricingTask;
