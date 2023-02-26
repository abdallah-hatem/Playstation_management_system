import { Link } from "react-router-dom";

export default function LinkComponent({ title = "title", url }) {
  return (
    <Link
      to={url}
      style={{
        marginTop: 10,
        display: "block",
        width: "fit-content",
        float: "right",
        textDecoration: "none",
      }}
    >
      {title}
    </Link>
  );
}
