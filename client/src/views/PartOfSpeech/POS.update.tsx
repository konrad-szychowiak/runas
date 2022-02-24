import {useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {api, error$alert} from "../../common/api";

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
    getCategories()
  }, [pos])

  if (!pos) return <></>
  const {name, description} = pos;

  const save = async () => {
    try {
      await axios.put(`http://localhost:8080/api/pos/${id}/`,
        {
          description: desc,
          name: title
        })
    } catch (e) {
      error$alert(e)
    }
  }

  const del = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/pos/${id}/`)
    } catch (e) {
      error$alert(e)
    } finally {
      getPOS();
    }
    // window.history.back();
  }

  const addCat = async () => {
    try {
      await axios.post(`http://localhost:8080/api/pos/${id}/category/`, {name: newCategoryName})
      setNewCategoryName('')
    } catch (e) {
      error$alert(e)
    } finally {
      getCategories();
    }
  }

  return (<>
      <div className="level">
        <div className="level-left">
          <span className="title">Part of Speech{/*: {(name === title)
            ? <em>{name}</em>
            : <><s style={{color: 'red'}}><q>{name}</q></s> <q>{title}</q></>}*/}
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

      <ModifiableTextField initialValue={title} onValueChange={setTitle} labelText={'Name'}/>
      <ModifiableTextField initialValue={desc} onValueChange={setDesc} labelText={'Description'}/>

      <h2 className="subtitle">Governed Categories</h2>

      <article className="card message is-primary">
        <div className="message-header">
          <p>New Category</p>
        </div>
        <div className="message-body">
          <p className={'mb-2'}>
            Paradigm Categories are a set of <i><b>abstract</b></i> forms a word belonging to a part of speech can take.
            <br/>
            For verbs it might be tense, aspect and mood forms, for nouns it may be number or definiteness—you decide.
            <br/>
            For every entry that has this part of speech, you will be asked to provide specific word forms
            for every paradigm category set here.
          </p>
          <ModifiableTextField initialValue={newCategoryName} onValueChange={setNewCategoryName}
                               labelText={'New Category'}/>
          <button className="button is-primary" onClick={() => addCat()}>Create</button>
        </div>
      </article>


      {categories && categories.map(el => <>
        <Cat name={el.name}
             linkTo={''}
             id={el.part_of_speech}
             catID={el.category_id}
             buttonClass={'button is-danger'}
             buttonText={'Delete'}
             onDelete={() => {
               getPOS()
             }}
        />
      </>)}

    </>
  )
}

// fixme
type CatProps = {
  name: string,
  linkTo: string,
  id: number,
  catID: number,
  buttonText?: string,
  buttonClass?: string,
  onDelete: Function,
}

function Cat({
               name,
               id,
               catID,
               linkTo,
               buttonText = 'Edit',
               buttonClass = 'button',
               onDelete
             }: CatProps) {
  const [text, setText] = useState(name);

  const save = async () => {
    try {
      await api.put(`/pos/${id}/category/${catID}`, {name: text})
    } catch (e) {
      error$alert(e)
    }
  }

  return <>
    <div className="card mb-4">
      <div className="card-content ">
        <div className="level">
          <div className="level-left">
            <ModifiableTextField initialValue={name} onValueChange={setText} noLabel/>
          </div>
          <div className="level-right">
            <button className={'button is-primary mr-2'}
                    onClick={save}>Save Changes
            </button>
            <button className={buttonClass}
                    onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:8080/api/pos/${id}/category/${catID}`);
                        onDelete()
                      }
                      catch (e) {
                        error$alert(e)
                      }
                    }}>{buttonText}</button>
          </div>
        </div>
      </div>
    </div>
  </>
}