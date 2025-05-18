const ShapeRenderer = ({
  shapeId,
  color,
  size,
  letter = null,
  fontSize = null,
}) => {
  const baseStyle = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color,
    position: "relative",
  };

  let shapeStyle = {};
  const SCALE = 0.8;

  switch (shapeId) {
    case "circle":
      shapeStyle = {
        ...baseStyle,
        borderRadius: "50%",
        transform: `scale(${SCALE})`,
      };
      break;

    case "square":
      shapeStyle = { ...baseStyle, transform: `scale(${SCALE})` };
      break;

    case "triangle":
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
            position: "relative",
            display: letter ? "flex" : "block",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${SCALE})`,
          }}
        >
          {letter && (
            <span
              style={{
                position: "absolute",
                top: size / 4,
                fontSize: fontSize || size / 2,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {letter}
            </span>
          )}
        </div>
      );

    case "diamond":
      shapeStyle = {
        ...baseStyle,
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        transform: `scale(${SCALE})`,
      };
      break;

    case "pentagon":
      shapeStyle = {
        ...baseStyle,
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        transform: `scale(${SCALE})`,
      };
      break;

    default:
      shapeStyle = { ...baseStyle };
  }

  return (
    <div style={shapeStyle}>
      {letter && (
        <span
          style={{
            fontSize: fontSize || size / 2,
            fontWeight: "bold",
            color: "white",
            transform: shapeId === "diamond" ? "rotate(-45deg)" : "none",
            transform: `scale(${SCALE})`,
          }}
        >
          {letter}
        </span>
      )}
    </div>
  );
};

export default ShapeRenderer;
