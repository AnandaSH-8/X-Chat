import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ textAlign: "center", padding: 80 }}>
    <h1>404 - Page Not Found</h1>
    <Link to="/">Go Home</Link>
  </div>
);

export default NotFound;
