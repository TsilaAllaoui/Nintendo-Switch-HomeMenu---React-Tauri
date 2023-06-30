import "../styles/GameCard.scss";

function GameCard({
  title,
  icon,
  active,
}: {
  title: string;
  icon: number[];
  active: boolean;
}) {
  const createDataUri = (format: string, data: number[]) => {
    let str = "";
    for (let byte of data) str += String.fromCharCode(byte);
    let res = `data:${format};base64,${btoa(str)}`;
    return res;
  };

  return (
    <div className="game-card-container">
      <div className="title-container">
        <p
          id="title"
          style={{
            animation:
              active && title.length > 35 ? "autoscroll 15000ms infinite" : "",
            color: active ? "rgb(64,206,195)" : "white",
          }}
        >
          {title}
        </p>
      </div>
      <div
        className="game-card"
        style={{
          border: `solid ${active ? "rgb(64,206,195)" : "#2d2d2d"} 6px`,
          animation: active ? "animGlow 750ms infinite alternate" : "",
        }}
      >
        <div
          className="inner-container"
          style={{
            backgroundImage: "url(" + createDataUri("image/png", icon) + ")",
          }}
        ></div>
      </div>
    </div>
  );
}

export default GameCard;
