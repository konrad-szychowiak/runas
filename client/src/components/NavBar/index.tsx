import React from 'react';
import {Link} from "react-router-dom";



function NavBar() {

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to={'/'}> Home </Link>
            <Link className="navbar-item" to={'/design'}> Analysis </Link>
            <Link className="navbar-item" to={'/wizard'}> Create </Link>
            {/*<Link className="navbar-item" to={'/context'}> Context </Link>*/}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;