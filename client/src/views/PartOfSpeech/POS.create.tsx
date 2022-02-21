import React, {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export function POSCreate() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const onCreate = async () => {
    await axios.post(`http://localhost:8080/api/pos/`, {name, description});
    window.history.back();
  }

  return <>
    <div className={'card'}>
      <div className={'card-content'}>
        <input className={"input"} placeholder={'Name'} value={name} onChange={event => setName(event.target.value)}/>
        <textarea className={"textarea"} placeholder={'Description'} value={description}
                  onChange={event => setDescription(event.target.value)}/>
        {/*<Link to={'/design/pos/'}>*/}
          <button className={"button"} onClick={() => onCreate()}>Add</button>
        {/*</Link>*/}
      </div>
    </div>

  </>;
}