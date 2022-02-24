import React, {useState} from "react";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {ContextSchema} from "./schemas";
import {ContextUpdate} from "./Context.update";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {api, error$alert} from "../../common/api";

export function ContextList() {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const {
    value: contextList, call: getContexts
  } = useGetAsync(
    async () => {
      try {
        return (await api.get(`/context/`)).data
      } catch (e) {
        error$alert(e)
      }
    },
    {
      initialCall: true
    })

  const add = async () => {
    if (newName === '') {
      alert('Please input some values into the required field(s)!')
      return;
    }
    try {
      const res = (await axios.post(`http://localhost:8080/api/context/`, {
        name: newName,
        description: newDescription,
      })).data
      setNewName('')
      setNewDescription('')
      console.log(res)
    } catch (e) {
      error$alert(e)
    } finally {
      getContexts()
    }
  }

  const remove = async ({context_id: id}: ContextSchema) => {
    try {
      const res = (await axios.delete(`http://localhost:8080/api/context/${id}`)).data
      console.log(res)
    } catch (e) {
      error$alert(e)
    } finally {
      getContexts()
    }
  }

  return <>
    <h1 className="title">List of Contexts</h1>

    <article className="card message is-primary">
      <div className="message-header">
        <p>New Context</p>
      </div>
      <div className="message-body">
        <p className={'mb-2'}>
          Context are short labels intended to quickly identify how a lexeme (a word) is used.
          Most common usage would be marking a lexeme as restricted to specific area of life (technical, medical, etc.),
          or some demographics (older speakers, youth slang, etc.).
        </p>

        <div className="columns">
          <div className="column">
            <ModifiableTextField labelText={'New context name... [required]'}
                                 initialValue={newName}
                                 onValueChange={setNewName}/>
          </div>

          <div className="column">
            <ModifiableTextField labelText={'... and its description'}
                                 initialValue={newDescription}
                                 onValueChange={setNewDescription}/>
          </div>
        </div>

        <button className="button is-primary" onClick={() => add()}>Create</button>

      </div>
    </article>

    {contextList && contextList.map(value => <>
        {/*<Context value={value} onDelete={remove}/>*/}
        <ContextUpdate context={value}
                       onSave={context => {
                         console.log({context})
                       }}
                       onDelete={remove}/>
      </>
    )}


  </>
}