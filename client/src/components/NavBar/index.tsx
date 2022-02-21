import React from 'react';
import {Link} from "react-router-dom";



function NavBar() {

  return (
    <>
      <section className="hero is-primary mb-5">
        <div className="hero-body">
          <p className="title">
            SQL Dictionary
          </p>
          <p className="subtitle">
            An SQL & NoSQL Database Management Showcase
          </p>
        </div>


      {/*  */}
        <div className="hero-foot">
          <nav className="tabs">
            <div className="container">
              <ul>
                <Link className="navbar-item" to={'/'}> Home </Link>
                <Link className="navbar-item" to={'/design'}> Analysis </Link>
                <Link className="navbar-item" to={'/wizard'}> Create </Link>
              </ul>
            </div>
          </nav>
        </div>
      </section>

      {/*<nav className="navbar" role="navigation" aria-label="main navigation">*/}
      {/*  <div id="navbarBasicExample" className="navbar-menu">*/}
      {/*    <div className="navbar-start">*/}

      {/*      /!*<Link className="navbar-item" to={'/context'}> Context </Link>*!/*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</nav>*/}
    </>
  );
}

export default NavBar;