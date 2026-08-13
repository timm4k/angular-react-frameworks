import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

const record = {
  id: "night-songs",
  title: "Night Songs",
  artist: "Cinderella",
};

function PurchaseTask() {
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");

  const buyItem = (item) => {
    setCart((current) => [...current, item]);
    setNotice(`${item.title} added to your cart`);
  };

  return (
    <ComparisonCard
      number="2.2"
      title="Purchase notification"
      badCode={snippets.purchase.bad}
      goodCode={snippets.purchase.good}
      problem="An effect cannot tell why the cart changed. Restoring a saved cart would incorrectly announce a new purchase"
      solution="Only the Buy action should show the notification. Restoring or editing the cart elsewhere remains silent"
      badFlow={["Any cart change", "Render", "Effect", "Notify"]}
      goodFlow={["Buy click", "Add item", "Notify"]}
    >
      <div className={styles.product}>
        <div className={styles.cover}>
          NIGHT
          <br />
          SONGS
        </div>
        <div>
          <strong>{record.title}</strong>
          <span>{record.artist}</span>
          <small>Cart: {cart.length}</small>
        </div>
        <button onClick={() => buyItem(record)}>Buy record</button>
      </div>
      <p className={styles.status} role="status">
        {notice || "Your cart is ready"}
      </p>
    </ComparisonCard>
  );
}

export default PurchaseTask;
