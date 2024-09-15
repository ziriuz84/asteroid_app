import { Link } from "react-router-dom";

export const LinkButton = (url: string, text: string) => {
  return (
    <li>
      <Link to={url}>{text}</Link>
    </li>
  )
}
