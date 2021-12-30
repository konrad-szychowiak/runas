import React, {useState} from 'react';
import axios from "axios";
import {useGetAsync} from "../../common/useAsyncState";
import {Button, Input} from "@vechaiui/react";


const Wizard = () => {
  const [categoriesInput, setCategoriesInput] = useState({});
  const [lemma, setLemma] = useState('');
  const [reqSpelling, setReqSpelling] = useState('');
  const [definition, setDefinition] = useState('');
  const [selectedPOS, setSelectedPOS] = useState('');
  const {value: categories} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${selectedPOS}/category`)).data, {
    dependencies: [selectedPOS],
    initialCall: false
  })
  const {value: paertsOfSpeech} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos`)).data) as { value: { pos_id, name, description }[] }

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
    console.log(re.data)
    const lxID = re.data.lexeme_id

    await Promise.all(data.map(async el => await saveInflected(lxID, el.key, el.spelling)))

    const lexeme = await axios.get(`http://localhost:8080/api/lexeme/${lxID}/full`)
    setReqSpelling(JSON.stringify(lexeme.data))
  }

  return (
    <div>
      <h1>LEXEME</h1>
      <div>
        <label htmlFor="lemma">lemma (spelling)</label>
        <input type="text" value={lemma} onChange={e => setLemma(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="def">definition (varchar 50)</label>
        <Input type="text" value={definition} onChange={e => setDefinition(e.target.value)}/>
      </div>
      <br/>
      <div>
        <label htmlFor="dog-names">choose part of speech:</label>
        <select id="dog-names" name="dog-names" onChange={e => setSelectedPOS(e.target.value)}>
          {
            (paertsOfSpeech ?? []).map(value => {
              return (<>
                <option key={value.pos_id} value={value.pos_id}>{value.name} {
                  value.description ?? ''
                }</option>
              </>)
            })
          }
        </select>
      </div>
      <div id="cats">
        {
          (categories ?? []).map(category => {
            return <div key={category.category_id}>
              <label htmlFor={`def-${category.category_id}`}>{category.name}:</label>
              <input id={`def-${category.category_id}`} type="text" value={categoriesInput[category.category_id] ?? ''}
                     onChange={e => setCategoriesInput(v => ({...v, [category.category_id]: e.target.value}))}/>
            </div>
          })
        }
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
      {reqSpelling && (<>
        <hr/>
        <pre id="spelling">
          {reqSpelling}
        </pre>
      </>)}
    </div>
  );
};

export default Wizard;

// localhost:8080/api/lexeme/
// {
//   "spelling": 1,
//   "pos": 1,
//   "definition": "A greeting"
// }

//

