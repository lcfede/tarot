import type { TarotCard } from "../data/types";
import CardImg from "./CardImg";

interface Props {
  cards: TarotCard[];
  onPick: (c: TarotCard) => void;
}

export default function CardGrid({ cards, onPick }: Props) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(85px,1fr))", gap: 10, justifyItems: "center", margin: "16px 0" }}>
        {cards.map((c, i) => (
          <div key={i} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onPick(c)}>
            <CardImg c={c} w={85} h={140} />
            <div style={{ fontSize: 10, color: "#888", marginTop: 3 }}>{c.nm}</div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 4 }}>
        {"👆 Toca cualquier carta para ver su significado completo, ejercicio práctico y significado invertido"}
      </p>
    </div>
  );
}
