import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {Link} from "react-router-dom";
import {POSRead} from "./POS.read";
import React from "react";

export function POSList() {
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
      {partsOfSpeech && partsOfSpeech.map(el => (<POSRead value={el}/>))}
      {/*</div>*/}
      {/*<div className={"column"}>*/}
      {/*<POSAdder/>*/}
      {/*</div>*/}
    </div>
    {/*</div>*/}
  </>
}