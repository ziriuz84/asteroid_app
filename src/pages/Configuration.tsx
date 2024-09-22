import { Link } from "react-router-dom"
export const Configuration = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/configuration/language">Language</Link>
          </li>
          <li>
            <Link to="/configuration/observatory">Observatory</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
