import {useParams} from "react-router-dom";
import {useGetAsync} from "../common/useAsyncState";
import axios from "axios";
import React, {useState} from "react";

export function POSWizard() {
  const {pos_id: id} = useParams();
  const {
    value: pos
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${id}`)).data, {
    dependencies: [],
    initialCall: true
  })
  const {
    value: categories,
    call: getCategories
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${id}/category`)).data, {
    dependencies: [],
    initialCall: true
  })
  const [cat, setCat] = useState('')
  const [desc, setDesc] = useState('')

  if (!pos) return <></>
  const {name, description} = pos;

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

  return (<>
      <div className="level">
        <div className="level-left">
          <span className="title">{name}</span>
        </div>
        <div className="level-right buttons">
          <button className={'button is-info'} onClick={() => save()}>Update</button>
          <button className="button is-danger" onClick={() => del()}>Delete</button>
        </div>
      </div>

      <div className="notification is-light">
        {description}
      </div>

      <div className={'card mb-4'}>
        <div className="card-content">
          <input className={'input'} disabled value={id}/>
          <input className={'input'} value={name}/>
          <textarea className={'textarea'} value={description ?? desc} onChange={e => setDesc(e.target.value)}/>



        </div>
      </div>

      <div className={'m-6'}>
        <input className={'input is-inline'} value={cat} onChange={event => setCat(event.target.value)}/>
        <button className="button" onClick={() => addCat()}>Add {cat}</button>
      </div>



      {categories && categories.map(el =>
        <div className={'card mb-4'}>
          <div className="card-content">
            {JSON.stringify(el)}
            <button className={'button is-small is-rounded is-danger'}
                    onClick={async () => {
                      await axios.delete(`http://localhost:8080/api/pos/${id}/category/${el.category_id}`);
                      getCategories();
                    }}
            >Delete
            </button>
          </div>
        </div>)}

    </>
  )
}