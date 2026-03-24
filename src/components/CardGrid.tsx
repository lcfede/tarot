import type { TarotCard } from "../data/types";
import CardImg from "./CardImg";

interface Props {
  cards: TarotCard[];
  onPick: (c: TarotCard) => void;
}

const CARD_W = 95;
const CARD_H = 156;

function desktopCols(n: number): number {
  if (n === 14) return 7;
  return 4; // major arcana sections (7 or 8 cards)
}

export default function CardGrid({ cards, onPick }: Props) {
  const cols = desktopCols(cards.length);
  return (
    <div>
      <style>{`
        .cg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(${CARD_W}px, 1fr));
          gap: 12px;
          justify-items: center;
          margin: 16px 0;
        }
        @media (min-width: 769px) {
          .cg-grid {
            grid-template-columns: repeat(var(--cg-cols), 1fr);
          }
        }
      `}</style>
      <div className="cg-grid" style={{ "--cg-cols": cols } as React.CSSProperties}>
        {cards.map((c, i) => (
          <div key={i} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onPick(c)}>
            <CardImg c={c} w={CARD_W} h={CARD_H} />
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{c.nm}</div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 4 }}>
        {"👆 Toca cualquier carta para ver su significado completo, ejercicio práctico y significado invertido"}
      </p>
    </div>
  );
}
