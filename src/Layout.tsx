import { Link, Outlet } from "react-router-dom";
export const Layout = () => {
  return (
    <div>
      <header><Link to="/">Asteroid App</Link></header>
      <Outlet />
    </div>
  );

}

