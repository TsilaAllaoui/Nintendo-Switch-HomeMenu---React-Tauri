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
    console.log(res);
    return res;
  }

  return (
    <div className="game-card" style={{ "border": `solid ${active ? "rgb(64,206,195)" : "#2d2d2d"} 5px`, animation: active ? "animGlox 1500ms infinite alternate" : "" }}>
      <div className="inner-container" style={{backgroundImage: "url(" + createDataUri("image/png", icon) + ")"}} >
        <p>{title}</p>
      </div>
    </div>
  );
}

export default GameCard;
