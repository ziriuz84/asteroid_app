import { Link } from 'react-router-dom';

export const BackMenu = ({ backto }) => {
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
    </nav >

  )

}
