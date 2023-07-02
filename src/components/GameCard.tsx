import "../styles/GameCard.scss";

function GameCard({
  title,
  icon,
  active,
  index,
  set
}: {
  title: string;
  icon: number[];
  active: boolean;
  index: number;
  set: (i: number) => void;
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
              active && title.length > 20 ? "autoscroll 7500ms infinite" : "",
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
        onMouseEnter={() => set(index)}
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
