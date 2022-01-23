import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import React from "react";
import {PartOfSpeech} from "../common/types";
import {Link, Outlet} from "react-router-dom";


function POS({value}: { value: PartOfSpeech }) {

  return <>
    <div className="card mb-4">
      <div className="card-content ">
        <div className="level">
          <div className="level-left">
            <span className="title is-5">{value.name}</span>
          </div>
          <div className="level-right">
            <Link to={`${value.pos_id}`}>
              <button className={'button'}>Edit</button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  </>
}


export function PartsOfSpeech() {
  const {value: partsOfSpeech} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/`)).data, {
    dependencies: [],
    initialCall: true
  })

  return <>
    <div>
      <div className={'level'}>
        <div className="level-left">
          <span className="title">Parts of speech</span>
        </div>

        <div className="level-right">
          <Link to="/design/pos/create">
            <button className="button is-info">Create</button>
          </Link>
        </div>
      </div>


      {/*<div className={'columns'}>*/}

      {/*<div className={"column"}>*/}
      {partsOfSpeech && partsOfSpeech.map(el => (<POS value={el}/>))}
      {/*</div>*/}
      {/*<div className={"column"}>*/}
      {/*<POSAdder/>*/}
      {/*</div>*/}
    </div>
    {/*</div>*/}
  </>
}

export function Design() {

  return (
    <section>
      <h1 className={'title'}>🧙 Lexicographic Analysis</h1>

      <article className="message is-info">
        <div className="message-header">
          <p>Info</p>
        </div>
        <div className="message-body">
          Here you can design how your dictionary will work, including the supported parts of speech
          and categories within them, contexts and many more.
        </div>
      </article>


      <div className="columns">
        <div className="column is-one-quarter">
          <aside className="menu">
            <p className="menu-label">
              General
            </p>
            <ul className="menu-list">
              <li><Link to={'/design/pos'}>Parts of Speech</Link></li>
              <li><Link to={'/design/context'}>Contexts</Link></li>
            </ul>
            {/*<p className="menu-label">*/}
            {/*  Administration*/}
            {/*</p>*/}
            {/*<ul className="menu-list">*/}
            {/*  <li><a>Team Settings</a></li>*/}
            {/*  <li>*/}
            {/*    <a className="is-active">Manage Your Team</a>*/}
            {/*    <ul>*/}
            {/*      <li><a>Members</a></li>*/}
            {/*      <li><a>Plugins</a></li>*/}
            {/*      <li><a>Add a member</a></li>*/}
            {/*    </ul>*/}
            {/*  </li>*/}
            {/*  <li><a>Invitations</a></li>*/}
            {/*  <li><a>Cloud Storage Environment Settings</a></li>*/}
            {/*  <li><a>Authentication</a></li>*/}
            {/*</ul>*/}
            {/*<p className="menu-label">*/}
            {/*  Transactions*/}
            {/*</p>*/}
            {/*<ul className="menu-list">*/}
            {/*  <li><a>Payments</a></li>*/}
            {/*  <li><a>Transfers</a></li>*/}
            {/*  <li><a>Balance</a></li>*/}
            {/*</ul>*/}
          </aside>
        </div>
        <div className="column">
          <Outlet/>
        </div>

      </div>
    </section>
  )
}