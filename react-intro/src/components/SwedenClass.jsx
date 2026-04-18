import React, { Component } from "react";

import st1 from "../assets/images/Stockholm1.jpg";
import st2 from "../assets/images/Stockholm2.jpg";
import st3 from "../assets/images/Stockholm3.jpg";

class SwedenClass extends Component {
  render() {
    return (
      <section>
        <h1>Stockholm — Capital of Sweden</h1>
        <p>
          <strong>City:</strong> Stockholm
        </p>
        <p>
          <strong>Founded:</strong> 1252
        </p>
        <p>
          Stockholm is built across 14 islands where Lake Mälaren meets the
          Baltic Sea. Often called the "Venice of the North", the city is known
          for its bridges, waterfront views, and elegant architecture
        </p>
        <p>
          At night, Stockholm becomes especially atmospheric. The historic
          district of Gamla Stan glows with warm lantern light, bridges shine
          over dark blue water, and reflections create a mirror-like effect. The
          skyline feels calm, refined, and balanced between medieval charm and
          modern Scandinavian design
        </p>
        <ul>
          <li>Gamla Stan illuminated by warm night lights</li>
          <li>Stockholm City Hall glowing beside the water</li>
          <li>Panoramic views from Södermalm after sunset</li>
        </ul>
        <div className="gallery">
          <img src={st1} alt="Stockholm night 1" />
          <img src={st2} alt="Stockholm night 2" />
          <img src={st3} alt="Stockholm night 3" />
        </div>
      </section>
    );
  }
}

export default SwedenClass;
