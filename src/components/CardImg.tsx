import type { TarotCard } from "../data/types";

interface Props {
  c: TarotCard;
  w?: number;
  h?: number;
  onClick?: () => void;
  flip?: boolean;
  glow?: boolean;
}

export default function CardImg({ c, w = 100, h = 164, onClick, flip, glow }: Props) {
  if (flip) {
    return (
      <div
        onClick={onClick}
        style={{
          width: w, height: h, borderRadius: 8,
          cursor: onClick ? "pointer" : "default",
          background: "linear-gradient(145deg,#1a0a2e,#2d1b4e)",
          border: "2px solid #d4a843",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: glow ? "0 0 15px rgba(212,168,67,0.4)" : "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: w * 0.22, color: "#d4a843", opacity: 0.5 }}>✦</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: w, height: h, borderRadius: 8,
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        border: "2px solid " + c.cl + "55",
        boxShadow: glow ? "0 0 15px " + c.cl + "44" : "0 2px 8px rgba(0,0,0,0.4)",
        background: "#0a0a15",
      }}
    >
      <img
        src={c.im}
        alt={c.nm}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}
