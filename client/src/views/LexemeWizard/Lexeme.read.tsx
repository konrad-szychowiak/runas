import React from "react";
import {Link, useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {LexemeUsages} from "../../components/LexemeUsages";

export function LexemeRead() {
  const {lexeme_id: id} = useParams()

  const {value} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/lexeme/${id}/full`)).data, {
    dependencies: [id],
    initialCall: true
  })

  if (!value) return <></>

  const {definition, lemma, part_of_speech: pos, forms, contexts, ...lexeme} = value;

  return (<>
    <div className="--section">
      <div className="level">
        <div className="level-left">
          <p className="title is-4">{lemma}</p>
        </div>
        <div className="level-right">
          <Link to={'update'}>
            <button className="button ml-2 is-info">Update</button>
          </Link>
          <button className="button ml-2 is-danger" onClick={async () => {
            await axios.delete(`http://localhost:8080/api/lexeme/${id}`)
          }}>Delete
          </button>
        </div>
      </div>


      <div className="columns">
        <div className="column">
          <div className="content">
            <div className={'tags'}>
              <span className="tag is-info is-medium mr-2">{pos.name}</span>
              {contexts.map(context => (
                <span className="tag is-medium is-info is-light mr-2">{context.name}</span>
              ))}
            </div>
            <p className={'notification is-info is-light'}>{definition}</p>
          </div>

          <h2 className="subtitle">Inflected Forms</h2>

          <table className={'table is-bordered is-hoverable'}>
            {forms.map(({name, form}) => (
              <tr key={name + form}>
                <td>{name}</td>
                <td className="spelling">{form}</td>
              </tr>
            ))}
          </table>

          <LexemeUsages lexeme={lexeme}/>
        </div>

        <div className="column is-one-third">
          <code>{JSON.stringify(value)}</code>

          <h2 className="subtitle">This lexeme belongs to</h2>

        </div>
      </div>



      {/*<article className="message is-info">*/}




      {/*<pre>{JSON.stringify(lexeme)}</pre>*/}
    </div>
  </>)
}