import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import React, {useState} from "react";
import {PartOfSpeech} from "../common/types";
import {Outlet} from "react-router-dom";
import {Link} from "react-router-dom";


function POSWizard() {
  const {
    value: pos
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${id}/category`)).data, {
    dependencies: [],
    initialCall: true
  })
  if (!pos) return <></>
  const {pos_id: id, name, description} = pos;
  const {
    value: categories,
    call: getCategories
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${id}/category`)).data, {
    dependencies: [id],
    initialCall: true
  })
  const [cat, setCat] = useState('')
  const [desc, setDesc] = useState('')

  const save = async () => {
    await axios.put(`http://localhost:8080/api/pos/${id}/`,
      {
        description: desc
      })
  }

  const del = async () => {
    await axios.delete(`http://localhost:8080/api/pos/${id}/`)
  }


  const addCat = async () => {
    await axios.post(`http://localhost:8080/api/pos/${id}/category/`, {name: cat})
    setCat('')
    getCategories();
  }

  return (
    <div className={'card mb-4'}>
      <div className="card-content">
        <input className={'input'} disabled value={id}/>
        <input className={'input'} value={name}/>
        <textarea className={'textarea'} value={description ?? desc} onChange={e => setDesc(e.target.value)}/>
        <button className={'button'} onClick={() => save()}>Update</button>
        <button className="button is-danger" onClick={() => del()}>Delete</button>
        {categories && categories.map(el =>
          <pre>
          {JSON.stringify(el)}
        </pre>)}
        <input className={'input'} value={cat} onChange={event => setCat(event.target.value)}/>
        <button className="button" onClick={() => addCat()}>Add {cat}</button>
      </div>
    </div>
  )
}


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


export function POSAdder() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const onCreate = async () => {
    await axios.post(`http://localhost:8080/api/pos/`, {name, description});
  }

  return <>
    <div className={'card'}>
      <div className={'card-content'}>
        <input className={"input"} placeholder={'Name'} value={name} onChange={event => setName(event.target.value)}/>
        <textarea className={"textarea"} placeholder={'Description'} value={description}
                  onChange={event => setDescription(event.target.value)}/>
        <Link to={'/design/pos/'}>
          <button className={"button"} onClick={() => onCreate()}>Add</button>
        </Link>
      </div>
    </div>

  </>;
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