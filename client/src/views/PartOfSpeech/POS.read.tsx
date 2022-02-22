import {PartOfSpeech} from "../../common/types";
import {Link} from "react-router-dom";
import React from "react";

export function POSRead({value}: { value: PartOfSpeech }) {

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