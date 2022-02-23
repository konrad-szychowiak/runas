import React from "react";
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import {Link} from "react-router-dom";
import {error$alert} from "../common/api";

enum Group {
  Morph,
  Semantic
}

const element = (groupSubtype) => (/* props */) => {

  const {
    value,
    call: getValue
  } = useGetAsync(async () => {
    try {
    return (await axios.get(`http://localhost:8080/api/${groupSubtype}/`)).data
    }
    catch (e) {
      error$alert(e);
    }
  }, {
    initialCall: true
  })

  return (<>
    <div>
      <div className={'level'}>
        <div className="level-left">
          <span className="title">Groups</span>
        </div>

        <div className="level-right">
          <Link to="/design/pos/create">
            <button className="button is-info">Create</button>
          </Link>
        </div>
      </div>

      <code>{JSON.stringify([])}</code>

    </div>
  </>)
}

export const MorphologicalGroup = element(Group.Morph);

export const SemanticGroup = element(Group.Semantic);