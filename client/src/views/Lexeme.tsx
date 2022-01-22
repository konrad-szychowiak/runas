import React from "react";
import {Link, useParams} from "react-router-dom";
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";

export function Lexeme() {
  const {lexeme_id: id} = useParams();
  const {value} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/lexeme/${id}/full`)).data, {
    dependencies: [id],
    initialCall: true
  })
  if (!value) return <></>


  const {definition, lemma, part_of_speech: pos, forms, contexts, ...lexeme} = value;

  return (<>
    <div className="card mb-4">
      <div className="card-content">
        {/*<div className="media">*/}
        {/*  <div className="media-content">*/}
        <p className="title is-4">{lemma}</p>
        <p className="subtitle is-6"><i>{pos.name}</i> #{id}</p>
        {/*</div>*/}
        {/*</div>*/}

        <div className="content">
          {contexts.length > 0 && <span className={'has-text-info'}>({contexts.map(context => <em>{context.name}</em>)})&nbsp;</span>}
          {definition}
        </div>

        <ul>
          {forms.map(({name, form}) => (
            <li key={name + form}><code>{name}</code> <span className="spelling">{form}</span></li>
          ))}
        </ul>

        <button className="button" onClick={() => alert("TODO")}>Update</button>

        <pre>{JSON.stringify(lexeme)}</pre>
      </div>
    </div>
  </>)
}