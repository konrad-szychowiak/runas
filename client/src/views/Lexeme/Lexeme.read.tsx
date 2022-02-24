import React from "react";
import {Link, useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {LexemeUsages} from "../../components/LexemeUsages";
import {api, error$alert} from "../../common/api";

export function LexemeRead() {
  const {lexeme_id: id} = useParams()

  const {value} = useGetAsync(async () => {
    try {
      return (await axios.get(`http://localhost:8080/api/lexeme/${id}/full`)).data
    } catch (e) {
      error$alert(e)
    }
  }, {
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
            <button className="button ml-2 is-primary">Update</button>
          </Link>
          <button className="button ml-2 is-danger" onClick={async () => {
            try {
              await api.delete(`http://localhost:8080/api/lexeme/${id}`)
              window.history.back()
            } catch (e) {
              error$alert(e)
            }
          }}>Delete
          </button>
        </div>
      </div>


      <div className="columns">
        <div className="column">
          <div className="content">
            <div className={'tags'}>

              <TooltipTag tag={<span className="tag is-info is-medium mr-2">{pos.name}</span>}
                          tooltip={pos?.description}/>

              {contexts.map(context => (
                <>
                  <TooltipTag tag={<span className="tag is-medium is-info is-light mr-2">{context.name}</span>}
                              tooltip={context?.description}/>
                </>
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
          <h2 className="subtitle">This lexeme belongs to</h2>

          {/*<code>{JSON.stringify(value)}</code>*/}

          <div className={'tags'}>
            {value?.groups.map(el => <>
              <Link to={`/group/${el.group_id}`}>
                <TooltipTag tag={<span className="tag is-link is-small is-light mr-2">
                  {el.description}
                </span>} tooltip={<>
                  {JSON.stringify(el)}
                </>}/>
              </Link>
            </>)}
          </div>
        </div>
      </div>


      {/*<article className="message is-info">*/}


      {/*<pre>{JSON.stringify(lexeme)}</pre>*/}
    </div>
  </>)
}

function TooltipTag({tag, tooltip}: { tag: JSX.Element, tooltip: JSX.Element | string }) {
  return <>
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        {tag}
      </div>
      <div className="dropdown-menu" id="dropdown-menu4" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            {tooltip}
          </div>
        </div>
      </div>
    </div>
  </>
}