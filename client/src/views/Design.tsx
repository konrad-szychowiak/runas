import React from "react";
import {Link, Outlet} from "react-router-dom";


export function DesignInfo() {
  return <>
    <article className="message is-info">
      <div className="message-header">
        <p>Info</p>
      </div>
      <div className="message-body">
        Here you can design how your dictionary will work, including the supported parts of speech
        and categories within them, contexts and many more.
      </div>
    </article>
  </>
}

export function Design() {

  return (
    <section>
      <h1 className={'title'}>Dictionary Configuration</h1>

      <div className="columns">
        <div className="column is-one-quarter">
          <aside className="menu">
            <ul className="menu-list">
              <li><Link to={'/design'}><i>Help</i></Link></li>
            </ul>
            <p className="menu-label">
              General
            </p>
            <ul className="menu-list">
              <li><Link to={'/design/pos'}>Parts of Speech</Link></li>
              <li><Link to={'/design/context'}>Contexts</Link></li>
              <li><Link to={'/design/examples'}>Use Examples</Link></li>
            </ul>
            <p className="menu-label">
              Groups
            </p>
            <ul className="menu-list">
              <li><Link to={'/design/group/morphological'}>Morphological Groups</Link></li>
              <li><Link to={'/design/group/semantic'}>Semantic Groups</Link></li>
            </ul>
          </aside>
        </div>
        <div className="column">
          <Outlet/>
        </div>

      </div>
    </section>
  )
}