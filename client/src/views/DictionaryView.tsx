import React from 'react';
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import {Link} from "react-router-dom";

type Lexeme = {
  id: number;
  lemma: string;
  definition: string;
  pos: string
  spelling_id: number
  pos_id: number
}
const DictionaryEntry = ({lexeme}: { lexeme: Lexeme }) => {

  if (!lexeme) return <></>

  const {id, definition, lemma, pos} = lexeme;
  return (<>
    <div className="card mb-4">
      <div className="card-content">
        {/*<div className="media">*/}
        {/*<div className="media-content">*/}
        {/*  <span className={"ajdi mr-2"}>{id}</span>*/}
        <Link to={`/lexeme/${id}`}><span className={'spelling mr-2'}>{lemma}</span></Link>
        <span className={'category mr-2'}>{pos}</span>
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
  const {value: listOfLemmas} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/lexeme/`)).data, {
    dependencies: [],
    initialCall: true
  })

  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


  return (
    <div>
      <h1 className={'title'}>Dictionary View</h1>
      {listOfLemmas && listOfLemmas.map(el => {
          return (<>
            <DictionaryEntry lexeme={el} key={'lemma-entry-' + el.id}/>
          </>)
        }
      )
      }

    </div>
  )
}

