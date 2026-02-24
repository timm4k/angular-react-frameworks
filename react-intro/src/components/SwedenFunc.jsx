import React from "react";

import sw1 from "../assets/images/Sweden_night-1.jpg";
import sw2 from "../assets/images/Sweden_night-2.jpg";
import sw3 from "../assets/images/Sweden_nigh-3.jpg";

function SwedenFunc() {
  return (
    <section>
      <h1>Sweden</h1>
      <p>
        <strong>Country:</strong> Kingdom of Sweden
      </p>
      <p>
        <strong>Established:</strong> 1523 (modern Swedish state)
      </p>
      <p>
        Sweden is a Scandinavian country in Northern Europe known for its
        forests, lakes, clean cities, and strong cultural identity. It blends
        modern innovation with deep historical traditions and a strong sense of
        harmony with nature
      </p>
      <p>
        At night, Sweden reveals a different atmosphere. In the northern
        regions, the sky may glow with the Aurora Borealis, creating waves of
        green light across the darkness. In cities and coastal areas, soft
        golden lights reflect in calm water, producing a peaceful and cinematic
        scenery
      </p>
      <ul>
        <li>Quiet waterfront cities with luminous reflections</li>
        <li>Long summer twilight nights</li>
        <li>Famous for the Northern Lights in Lapland</li>
      </ul>
      <div className="gallery">
        <img src={sw1} alt="Sweden night 1" />
        <img src={sw2} alt="Sweden night 2" />
        <img src={sw3} alt="Sweden night 3" />
      </div>
    </section>
  );
}

export default SwedenFunc;
