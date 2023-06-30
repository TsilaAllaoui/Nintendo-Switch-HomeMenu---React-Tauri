import "../styles/Button.scss";



function Button({
  button,
}: {
  button: { label: string; icon: JSX.Element; color: string };
}) {
  return (
    <div
      className="button"
      style={{
        color: button.color,
        transform: `rotate(${button.label == "controller" ? "30deg" : "0"})`,
      }}
    >
      {button.icon}
    </div>
  );
}

export default Button;
