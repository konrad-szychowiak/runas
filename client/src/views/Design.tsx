import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import React, {useState} from "react";
import {PartOfSpeech} from "../common/types";

function POS({value}: { value: PartOfSpeech }) {
  const {pos_id: id, name, description} = value;
  const {
    value: categories,
    call: getCategories
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${id}/category`)).data, {
    dependencies: [id],
    initialCall: true
  })
  const [cat, setCat] = useState('')
  const [desc, setDesc] = useState('')

  const save = async () => {
    await axios.put(`http://localhost:8080/api/pos/${id}/`,
      {
        description: desc
      })
  }

  const del = async () => {
    await axios.delete(`http://localhost:8080/api/pos/${id}/`)
  }


  const addCat = async () => {
    await axios.post(`http://localhost:8080/api/pos/${id}/category/`, {name: cat})
    setCat('')
    getCategories();
  }

  return (
    <div className={'card mb-4'}>
      <div className="card-content">
        <input className={'input'} disabled value={id}/>
        <input className={'input'} value={name}/>
        <textarea className={'textarea'} value={description ?? desc} onChange={e => setDesc(e.target.value)}/>
        <button className={'button'} onClick={() => save()}>Update</button>
        <button className="button is-danger" onClick={() => del()}>Delete</button>
        {categories && categories.map(el =>
          <pre>
          {JSON.stringify(el)}
        </pre>)}
        <input className={'input'} value={cat} onChange={event => setCat(event.target.value)}/>
        <button className="button" onClick={() => addCat()}>Add {cat}</button>
      </div>
    </div>
  )
}

function POSAdder() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const onCreate = async () => {
    await axios.post(`http://localhost:8080/api/pos/`, {name, description});
  }

  return <>
    <div className={'card'}>
      <div className={'card-content'}>
        <input className={"input"} placeholder={'Name'} value={name} onChange={event => setName(event.target.value)}/>
        <textarea className={"textarea"} placeholder={'Description'} value={description}
                  onChange={event => setDescription(event.target.value)}/>
        <button className={"button"} onClick={() => onCreate()}>Add</button>
      </div>
    </div>

  </>;
}

export function Design() {
  const {value: partsOfSpeech} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/`)).data, {
    dependencies: [],
    initialCall: true
  })

  return (
    <section>
      <h1 className={'title'}>Parts of speech</h1>
      <div className="columns">
        <div className={'column'}>
          {partsOfSpeech && partsOfSpeech.map(el => (<POS value={el}/>))}
        </div>
        <div className={'column'}>
          <POSAdder/>
        </div>
      </div>
    </section>
  )
}