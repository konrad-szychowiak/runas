import React from "react";
import {Link, useParams} from "react-router-dom";
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";

export function Lexeme() {
  const {lexeme_id: id} = useParams()

  const {value} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/lexeme/${id}/full`)).data, {
    dependencies: [id],
    initialCall: true
  })

  if (!value) return <></>

  const {definition, lemma, part_of_speech: pos, forms, contexts, ...lexeme} = value;

  return (<>
    <div className="section">

      {/*<div className="media">*/}
      {/*<div className="media-content">*/}
      <div className="level">
        <div className="level-left">
          <p className="title is-4">{lemma}</p>
        </div>
        <div className="level-right">
          <button className="button ml-2 is-info" onClick={() => alert("TODO")}>Update</button>
          <button className="button ml-2 is-danger" onClick={async () => {
            await axios.delete(`http://localhost:8080/api/lexeme/${id}`)
          }}>Delete
          </button>
        </div>
      </div>

      {/*<p className="subtitle is-6">*/}

      {/*</p>*/}
      {/*</div>*/}
      {/*</div>*/}

      <div className="content">
        <div className={'tags'}>
          <span className="tag is-info is-medium mr-2">{pos.name}</span>
          {/*</div>*/}
          {/*<div className={'my-2'}>*/}
          {contexts.map(context => (
            <span className="tag is-medium is-info is-light mr-2">{context.name}</span>
          ))}
        </div>
        {/*{contexts.length > 0 &&*/}
        {/*    <span className={'has-text-info'}>*/}
        {/*          /!*({.join(', ')})&nbsp;*!/*/}
        {/*      </span>}*/}
        <p className={'notification is-info is-light'}>{definition}
        </p>
      </div>

      {/*<article className="message is-info">*/}
      {/*<div className="message-header">*/}
      {/*  /!*Info*!/*/}
      {/*  Forms*/}
      {/*  /!*<button className="delete"></button>*!/*/}
      {/*</div>*/}
      {/*<div className="message-body">*/}
      <table className={'table is-bordered is-hoverable'}>
        {forms.map(({name, form}) => (
          <tr key={name + form}>
            <td>{name}</td>
            <td className="spelling">{form}</td>
          </tr>
        ))}
      </table>
      {/*</div>*/}
      {/*</article>*/}

      {/*<pre>{JSON.stringify(lexeme)}</pre>*/}
    </div>
  </>)
}