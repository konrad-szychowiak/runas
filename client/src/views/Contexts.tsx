import React, {useState} from "react";
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";

type ContextProps = {
  value: { context_id: number, name: string, description: string },
  onDelete: Function
}

function Context(props: ContextProps) {
  const {value, onDelete} = props;
  const {context_id, name, description} = value;

  return (
    <>
      <div>
        <code>{name}</code>{description && `: ${description}`}
        <button className="button is-small">Update</button>
        <button className="button is-small is-danger" onClick={() => onDelete(context_id)}>Delete</button>
      </div>
    </>)
}

export function Contexts() {
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

  const remove = async (id: number) => {
    const res = (await axios.delete(`http://localhost:8080/api/context/${id}`)).data
    getContexts()
    console.log(res)
  }

  return <>
    <input type="text" className="input" value={newName} onChange={event => setNewName(event.target.value)}/>
    <button className="button" onClick={() => add()}>Add: {newName}</button>
    {contextList && contextList.map(value => <Context value={value} onDelete={remove}/>)}
  </>
}