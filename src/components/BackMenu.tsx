import { Link } from "react-router-dom";

type Parameter = {
  backto: string;
};

export const BackMenu = ({ backto }: Parameter) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to={backto}>Back</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
};
