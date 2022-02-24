import React from 'react';
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import {Link} from "react-router-dom";
import {error$alert} from "../common/api";

type Lexeme = {
  id: number;
  lemma: string;
  definition: string;
  pos: string
  spelling_id: number
  pos_id: number
}

export const DictionaryEntry = ({lexeme}: { lexeme: Lexeme }) => {

  if (!lexeme) return <></>

  const {id, definition, lemma, pos} = lexeme;
  return (<>
    <div className="card mb-4">
      <div className="card-content">
        {/*<div className="media">*/}
        {/*<div className="media-content">*/}
        {/*  <span className={"ajdi mr-2"}>{id}</span>*/}
        <Link to={`/lexeme/${id}`}><span className={'spelling mr-2'}>{lemma}</span></Link>
        <span className={'tag is-light is-link mr-2'}>{pos}</span>
        {/*</div>*/}
        {/*</div>*/}
        {/*<div className="content">*/}
        <span>{definition}</span>
        {/*</div>*/}
      </div>
    </div>
  </>);
}

export const DictionaryView = () => {
  const {value: listOfLemmas} = useGetAsync(
    async () => {
      try {
        return (await axios.get(`http://localhost:8080/api/lexeme/`)).data
      } catch (e) {
        error$alert(e)
      }
    },
    {
      initialCall: true
    })

  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  return (
    <div>
      <h1 className={'title'}>Dictionary View</h1>

      {(!listOfLemmas || listOfLemmas.length === 0) &&
          <article className="message is-info">
              <div className="message-header">
                  <p>Empty View?</p>
              </div>
              <div className="message-body">
                  <p>First and foremost, <b>don't panic! It might be not a bug, but a feature!</b></p>
                  <p>
                      If there is nothing here either there are <b>no entries</b> in the dictionary
                      or you have <b>lost connection with the server</b> (and a popup with error info showed up).
                  </p>
                  <p>
                      In case of the former, please go to <Link to={'/design'}>the dictionary configuration</Link>,
                      ensure that there are appropriate <i>Parts of Speech</i> set and then go to <Link to={'/wizard'}>the
                      new entry wizard</Link> to add new entries.
                  </p>
                  <p>
                      In case of the latter, please try again later and if the problem persists, please contact the
                      administrator.
                  </p>
              </div>
          </article>
      }

      {listOfLemmas && listOfLemmas.map(el => {
          return (<>
            <DictionaryEntry lexeme={el} key={'lemma-entry-' + el.id}/>
          </>)
        }
      )}
    </div>
  )
}
