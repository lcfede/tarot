import { COURSE } from "../data/course";
import { hf } from "../constants";

interface Props {
  cur: string;
  chatOpen: boolean;
  showPulse: boolean;
  onToggleNav: () => void;
  onToggleChat: () => void;
}

export default function Header({ cur, chatOpen, showPulse, onToggleNav, onToggleChat }: Props) {
  const cm = COURSE.find((m) => m.l.some((l) => l.id === cur));
  const cl = cm ? cm.l.find((l) => l.id === cur) : null;

  return (
    <div style={{ padding: "10px 16px", borderBottom: "1px solid #151520", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onToggleNav} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: 2 }}>
          {"☰"}
        </button>
        <div>
          <div style={{ fontSize: 10, color: "#555" }}>{cm ? cm.i + " " + cm.t : ""}</div>
          <div style={{ fontSize: 13, color: "#e0d5c0", fontFamily: hf, fontWeight: 600 }}>{cl ? cl.t : ""}</div>
        </div>
      </div>
      <button
        onClick={onToggleChat}
        style={{ padding: "5px 12px", borderRadius: 16, border: "1px solid #333", background: chatOpen ? "rgba(212,168,67,0.1)" : "transparent", color: chatOpen ? "#d4a843" : "#888", fontSize: 11, cursor: "pointer", position: "relative" }}
      >
        {"🔮 Tutor IA"}
        {showPulse && (
          <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#d4a843", animation: "pulse 2s infinite" }} />
        )}
      </button>
    </div>
  );
}
