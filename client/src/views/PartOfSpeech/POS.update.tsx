import {useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {ModifiableTextField} from "../../components/ModifiableTextField";

export function POSUpdate() {
  const {pos_id: id} = useParams();
  const {value: pos, call: getPOS} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/pos/${id}`)).data,
    {initialCall: true}
  )
  const {value: categories, call: getCategories} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/pos/${id}/category`)).data,
    {initialCall: true}
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [desc, setDesc] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    setDesc(description)
    setTitle(name)
  }, [pos])

  if (!pos) return <></>
  const {name, description} = pos;

  const save = async () => {
    await axios.put(`http://localhost:8080/api/pos/${id}/`,
      {
        description: desc,
        name: title
      })
    // window.history.back()
  }

  const del = async () => {
    await axios.delete(`http://localhost:8080/api/pos/${id}/`)
    getPOS();
    // window.history.back();
  }

  const addCat = async () => {
    await axios.post(`http://localhost:8080/api/pos/${id}/category/`, {name: newCategoryName})
    setNewCategoryName('')
    getCategories();
  }

  return (<>
      <div className="level">
        <div className="level-left">
          <span className="title">Part of Speech: {(name === title)
            ? <q>name</q>
            : <><s style={{color: 'red'}}><q>{name}</q></s> <q>{title}</q></>}
          </span>
        </div>

        <div className="level-right buttons">
          <button className={'button is-info'} onClick={() => save()}>Save Changes</button>
          <button className="button is-danger" onClick={() => del()}>Delete</button>
        </div>
      </div>

      {/*<div className="notification is-light">*/}
      {/*  {description}*/}
      {/*</div>*/}

      <ModifiableTextField initialValue={title} onValueChange={v => setTitle(v)} labelText={'Name'}/>
      <ModifiableTextField initialValue={desc} onValueChange={setDesc} labelText={'Description'}/>

      <h2 className="subtitle">Governed Categories</h2>

      {/*<div className={'card mb-4'}>*/}
      {/*  <div className="card-content">*/}
      <ModifiableTextField initialValue={newCategoryName} onValueChange={setNewCategoryName} labelText={'New Category'}/>
      <button className="button" onClick={() => addCat()}>Add {newCategoryName}</button>
      {/*</div>*/}
      {/*</div>*/}

      {categories && categories.map(el => <>
        <Cat name={el.name}
             linkTo={''}
             id={el.part_of_speech}
             catID={el.category_id}
             buttonClass={'button is-danger'}
             buttonText={'Delete'}/>
      </>)}

    </>
  )
}

// fixme
function Cat({
               name,
               id,
               catID,
               linkTo,
               buttonText = 'Edit',
               buttonClass = 'button'
             }: { name: string, linkTo: string, id: number, catID: number, buttonText?: string, buttonClass?: string }) {
  const [text, setText] = useState(name);
  const save = () => {
    alert('TODO')
  }
  return <>
    <div className="card mb-4">
      <div className="card-content ">
        <div className="level">
          <div className="level-left">
            <ModifiableTextField initialValue={name} onValueChange={setText} noLabel/>
          </div>
          <div className="level-right">
            <button className={'button mr-2'}
                    onClick={save}>Save Changes
            </button>
            <button className={buttonClass}
                    onClick={async () => {
                      await axios.delete(`http://localhost:8080/api/pos/${id}/category/${catID}`);
                    }}>{buttonText}</button>
          </div>
        </div>
      </div>
    </div>
  </>
}