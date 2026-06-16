import { useState } from "react";
import { getGameGradient, getGameInitials } from "../utils/gameColors";

const BROKEN_HOSTS = ["example.com", "chatgpt.com", "a.com"];

function isValidUrl(url) {
  if (!url) return false;
  return !BROKEN_HOSTS.some((h) => url.includes(h));
}

export default function GameCover({ game, fontSize = "3rem" }) {
  const [imgError, setImgError] = useState(false);
  const validUrl = isValidUrl(game?.capaUrl);

  if (validUrl && !imgError) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: getGameGradient(game?.id) }}>
        <img
          src={game.capaUrl}
          alt={game?.titulo}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: getGameGradient(game?.id),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.85)",
        fontSize,
        fontWeight: 800,
        letterSpacing: "-1px",
        userSelect: "none",
        fontFamily: "var(--font-sans)",
      }}
    >
      {getGameInitials(game?.titulo)}
    </div>
  );
}
