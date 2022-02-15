import React, {useState} from "react";
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import {DictionarySearch} from "./DictionarySearch";

export function UseExamples() {
  const [text, setText] = useState('');

  const {
    value,
    call: getValue
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/example/`)).data, {
    dependencies: [],
    initialCall: true
  })

  const createUseExample = async () => {
    await axios.post(`http://localhost:8080/api/example/`, {text})
    getValue();
  }

  const deleteUseExample = async (id) => {
    await axios.delete(`http://localhost:8080/api/example/${id}`)
    getValue();
  }

  return <>
    <div>
      <div className="level">
        <div className="level-left">
          <div className="title">Use Examples</div>
        </div>
        <div className="level-right">
          <button className="button is-info"
                  onClick={() => createUseExample()}>Create
          </button>
        </div>
      </div>

      <textarea name="" id="" rows={2} className="textarea mb-4" value={text} onChange={event => setText(event.target.value)}/>

      {value && value.map(el => <div className="message">
        ${el.example_id} {JSON.stringify(el)}
        <button className="button is-danger is-small is-rounded" onClick={() => deleteUseExample(el.example_id)}>delete</button>
        <DictionarySearch />
        <button className={'button'}>Assign</button>
      </div>)}
    </div>
  </>
}