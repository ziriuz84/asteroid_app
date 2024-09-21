// import React from "react";
import { Link } from "react-router-dom";
// import { LinkButton } from "../components/LinkButton";

export const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/configuration">Configuration</Link>
          </li>
          <li>
            <Link to="/scheduling">Scheduling</Link>
          </li>
        </ul>
      </nav>
      {/* <form */}
      {/*   className="row" */}
      {/*   onSubmit={(e) => { */}
      {/*     e.preventDefault(); */}
      {/*     greet(); */}
      {/*   }} */}
      {/* > */}
      {/*   <input */}
      {/*     id="greet-input" */}
      {/*     onChange={(e) => setName(e.currentTarget.value)} */}
      {/*     placeholder="Enter a name..." */}
      {/*   /> */}
      {/*   <button type="submit">Greet</button> */}
      {/* </form> */}
      {/**/}
      {/* <p>{greetMsg}</p> */}
    </div>
  )
}
