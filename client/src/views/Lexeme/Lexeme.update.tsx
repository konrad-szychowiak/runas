import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useGetAsync} from "../../common/useAsyncState";
import {ContextCheckbox} from "../../components/ContextCheckbox";
import {useParams} from "react-router-dom";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import _ from 'lodash';


function FormsEditor({forms}: { forms: { name: string, form: string, lexeme: number, category: number }[] }) {
  const [table, setTable] = useState({})
  const [ids, setIDs] = useState({})
  useEffect(() => {
    forms.forEach(form => {
      setTable({...table, [form.name]: form.form})
    })
    forms.forEach(({name, category, lexeme}) => {
      setIDs({...table, [name]: {category, lexeme}})
    })
  }, [forms])

  const saveInflected = async (lexeme, category, spelling) => {
    await axios.post(`http://localhost:8080/api/lexeme/${lexeme}/inflected/`,
      {
        category,
        spelling
      })
  }

  const save = async () => {
    // todo
    const merged = Object.keys(ids).map(key => ({ spelling: table[key], ...ids[key] }))
    console.log(merged)
    alert('TODO: ' + JSON.stringify(merged))
  }

  return <>
    {forms.map(({name, form}) => <>
      <div className={'field'} key={name}>
        <label className={'label'} htmlFor={`def-${name}`}>{name}:</label>
        <input className={'input'} id={`def-${name}`} type="text"
          value={table[name]}
          onChange={e => {
            const value = e.target.value
            setTable(v => ({...v, [name]: value}))
          }}
        />
      </div>
    </>)}

    <div className={'block'}>
      <button className={'button is-primary'}
              onClick={save}>Update Forms
      </button>
    </div>
    {/*<div className={'field'} key={name}>*/}
    {/*  <label className={'label'} htmlFor={`def-${name}`}>{name}:</label>*/}
    {/*  <input className={'input'} id={`def-${name}`} type="text"*/}
    {/*         value={categoriesInput[name] ?? ''}*/}
    {/*         onChange={e => setCategoriesInput(v => ({...v, [name]: e.target.value}))}/>*/}
    {/*</div>*/}
  </>
}

export const LexemeUpdate = () => {
  const {lexeme_id: id} = useParams();

  const [categoriesInput, setCategoriesInput] = useState({});
  const [lemma, setLemma] = useState('');
  const [reqSpelling, setReqSpelling] = useState('');
  const [definition, setDefinition] = useState('');
  const [selectedPOS, setSelectedPOS] = useState<any>({});
  const [posDescription, setPosDescription] = useState('')
  const [selectedContexts, setSelectedContexts] = useState([] as number[]);

  const {value: lexeme} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/lexeme/${id}/full`)).data)

  useEffect(() => {
    console.log(lexeme)
    setLemma(lexeme?.lemma)
    setDefinition(lexeme?.definition)
    setSelectedPOS(lexeme?.part_of_speech)
    lexeme?.forms.forEach(form => {
      setCategoriesInput({...categoriesInput, [form.name]: form.form})
    })
  }, [lexeme])

  const {value: contexts} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/context`)).data)

  const saveSpelling = async (value) => {
    const reqSpellings = await axios.post(
      `http://localhost:8080/api/spelling`,
      {
        text: value
      }
    );
    return reqSpellings.data.word_id
  };

  /**
   *
   * @param lexeme id
   * @param context id
   */
  const saveContext = async (lexeme: number, context: number) => {
    await axios.post(`http://localhost:8080/api/lexeme/${lexeme}/context`, {
      id: context
    })
  }

  const handleSubmit = async () => {
    if (!lemma) return;
    // categories and inflected forms
    const inflectedForms = Object.keys(categoriesInput).map(key => ({key, value: categoriesInput[key]}));

    // save spellings to db
    const data = await Promise.all(inflectedForms.map(async el => ({
      ...el, spelling: await saveSpelling(el.value)
    })))

    console.log(data)

    // fixme: verify lemma is not null
    const lemmaID = await saveSpelling(lemma)

    const re = await axios.post('http://localhost:8080/api/lexeme', {
      spelling: lemmaID,
      pos: selectedPOS,
      definition
    })

    const lxID = re.data.lexeme_id

    // FIXME
    // await Promise.all(data.map(async el => await saveInflected(lxID, el.key, el.spelling)))
    await Promise.all(selectedContexts.map(async el => await saveContext(lxID, el)))
    const lexeme = await axios.get(`http://localhost:8080/api/lexeme/${lxID}/full`)

    setReqSpelling(JSON.stringify(lexeme.data))
  }

  return (
    <>
      <div className={'section'}>
        <h1 className={'title'}>🧙 LEXEME / update</h1>

        {/*<pre>{JSON.stringify(lexeme)}</pre>*/}

        {/* POS */}
        <div className={'field block'}>
          <label className={'label'} htmlFor="dog-names">Part of Speech</label>
          <div className="tags">
            <span className={'tag is-info is-medium mr-2'}>{selectedPOS?.name}</span>
            <span className={'tag is-medium mr-2'}>{selectedPOS?.description}</span>
          </div>
        </div>

        <hr/>

        <div className="columns">
          <div className="column">
            <h2 className="subtitle">General</h2>

            {/*LEMMA*/}
            <ModifiableTextField initialValue={lemma} onValueChange={v => setLemma(v)}/>
            <button className={'button is-danger'}
                    onClick={() => alert('TODO')}>Update Spelling
            </button>

            <hr/>

            {/*DEFINITION*/}
            <ModifiableTextField initialValue={definition} onValueChange={setDefinition}
                                 labelText={'Definition (varchar 50)'}/>
            <button className={'button is-primary'}
                    onClick={() => alert('TODO')}>Update Definition
            </button>

            <hr/>

            <div className="field block">
              <label className={'label'}>Contexts</label>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                {contexts && contexts.map(context => <ContextCheckbox
                  onAdd={(id) => {
                    setSelectedContexts([...selectedContexts, id])
                    console.log(selectedContexts)
                  }}
                  onRemove={(id) => {
                    setSelectedContexts(selectedContexts.filter(el => el !== id))
                    console.log(selectedContexts)
                  }}
                  context={context}/>)}
              </div>
            </div>
            <button className={'button is-primary'}
                    onClick={() => alert('TODO')}>Update Contexts
            </button>
          </div>

          <div className="column">
            <h2 className="subtitle">Forms</h2>

            <FormsEditor forms={lexeme?.forms ?? []}/>
          </div>
        </div>

      </div>
    </>
  );
};