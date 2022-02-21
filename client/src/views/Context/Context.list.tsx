import React, {useState} from "react";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {ModifiableTextField} from "../LexemeWizard/Lexeme.create";
import {ContextSchema} from "./schemas";
import {ContextUpdate} from "./Context.update";

export function ContextList() {
  const [newName, setNewName] = useState('');

  const {
    value: contextList,
    call: getContexts
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/context/`)).data, {
    dependencies: [],
    initialCall: true
  })

  const add = async () => {
    const res = (await axios.post(`http://localhost:8080/api/context/`, {
      name: newName
    })).data
    setNewName('')
    getContexts()
    console.log(res)
  }

  const remove = async ({context_id: id}: ContextSchema) => {
    const res = (await axios.delete(`http://localhost:8080/api/context/${id}`)).data
    getContexts()
    console.log(res)
  }

  return <>
    <h1 className="title">List of Contexts</h1>

    <ModifiableTextField initialValue={newName} onValueChange={setNewName} labelText={'New Context'}/>
    <button className="button" onClick={() => add()}>Create</button>

    <hr/>

    {contextList && contextList.map(value => <>
        {/*<Context value={value} onDelete={remove}/>*/}
        <ContextUpdate context={value}
                       onSave={v => {
                         console.log(v)
                       }}
                       onDelete={remove}/>
      </>
    )}
  </>
}