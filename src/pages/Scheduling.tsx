import { Link } from "react-router-dom";

export const Scheduling = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/scheduling/weather_forecast">Weather Forecast</Link>
          </li>
          <li>
            <Link to="/scheduling/sun_moon_times">Sun Moon Times</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
