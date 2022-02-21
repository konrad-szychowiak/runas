import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useGetAsync} from "../../common/useAsyncState";
import {ContextCheckbox} from "../../components/ContextCheckbox";
import {useParams} from "react-router-dom";
import {LexemeUsages} from "../../components/LexemeUsages";
import {ModifiableTextField} from "./Lexeme.create";


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
  },[lexeme])

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

  const saveInflected = async (lexeme, category, spelling) => {
    await axios.post(`http://localhost:8080/api/lexeme/${lexeme}/inflected/`,
      {
        category,
        spelling
      })
  }

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

    await Promise.all(data.map(async el => await saveInflected(lxID, el.key, el.spelling)))
    await Promise.all(selectedContexts.map(async el => await saveContext(lxID, el)))
    const lexeme = await axios.get(`http://localhost:8080/api/lexeme/${lxID}/full`)

    setReqSpelling(JSON.stringify(lexeme.data))
  }

  return (
    <>
    <div className={'section'}>
      <h1 className={'title'}>🧙 LEXEME / update</h1>

      <ModifiableTextField initialValue={lemma} onValueChange={v=> setLemma(v)}/>

      <div className={'field block'}>
        <label className={'label'} htmlFor="def">definition (varchar 50)</label>
        <input className={'input'} type="text" value={definition} onChange={e => setDefinition(e.target.value)}/>
      </div>

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

      <div className={'field block'}>
        <label className={'label'} htmlFor="dog-names">choose part of speech:</label>
        <select className={'select is-small'}
                id="dog-names"
                name="dog-names"
                disabled>
          <option>{selectedPOS?.name}</option>
        </select>
        <q>{selectedPOS?.description}</q>
      </div>

      <h2 className={'subtitle'}>Inflected Forms</h2>

      <div className={'block'} id="cats">
        {
          (lexeme?.forms ?? []).map(({name}) => {
            return <div className={'field'} key={name}>
              <label className={'label'} htmlFor={`def-${name}`}>{name}:</label>
              <input className={'input'} id={`def-${name}`} type="text"
                     value={categoriesInput[name] ?? ''}
                     onChange={e => setCategoriesInput(v => ({...v, [name]: e.target.value}))}/>
            </div>
          })
        }
      </div>

      <LexemeUsages lexeme={lexeme}/>

      <br/>
      <div className={'block'}>
        <button className={'button is-primary'} onClick={handleSubmit}>Submit</button>
      </div>


      {reqSpelling && (<>
          <div className={'notification is-success'}>
            {reqSpelling}
          </div>
        </>
      )}
    </div>
  </>
  );
};