import React, {useState} from 'react';
import axios from "axios";
import {useGetAsync} from "../../common/useAsyncState";

function ContextCheckbox(props: { lexeme?: number, context: any }) {
  const [checked, setChecked] = useState(false)

  const toggleContext = async () => {
    // if (checked) {
    //   axios.post(`http://localhost:8080/api/lexeme/`)
    // }
  }

  return <div>
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)}/>
      <code>{props.context.name}</code> {props.context.description ?? ""}
    </label>
  </div>;
}

const Wizard = () => {
  const [categoriesInput, setCategoriesInput] = useState({});
  const [lemma, setLemma] = useState('');
  const [reqSpelling, setReqSpelling] = useState('');
  const [definition, setDefinition] = useState('');
  const [selectedPOS, setSelectedPOS] = useState('');
  const [posDescription, setPosDescription] = useState('')

  const {value: categories} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos/${selectedPOS}/category`)).data, {
    dependencies: [selectedPOS],
    initialCall: false
  })
  const {value: partsOfSpeech} = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/pos`)).data) as { value: { pos_id, name, description }[] }

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
    <div className={'section'}>
      <h1 className={'title'}>LEXEME</h1>

      <div className={'field block'}>
        <label className={'label'} htmlFor="lemma">lemma (spelling)</label>
        <input className={'input'} type="text" value={lemma} onChange={e => setLemma(e.target.value)}/>
      </div>

      <div className={'field block'}>
        <label className={'label'} htmlFor="def">definition (varchar 50)</label>
        <input className={'input'} type="text" value={definition} onChange={e => setDefinition(e.target.value)}/>
      </div>

      <div className={'field block'}>
        <label className={'label'} htmlFor="dog-names">choose part of speech:</label>
        <select className={'select is-small'}
                id="dog-names"
                name="dog-names"
                onChange={e => {
                  setSelectedPOS(e.target.value);
                }}>
          <option>(select)</option>
          {
            (partsOfSpeech ?? []).map(value => {
              return (<>
                <option key={value.pos_id} value={value.pos_id}>{value.name}</option>
              </>)
            })
          }
        </select>
        {posDescription && <q>{posDescription}</q>}
      </div>

      <div className={'block'} id="cats">
        {
          (categories ?? []).map(category => {
            return <div className={'field'} key={category.category_id}>
              <label className={'label'} htmlFor={`def-${category.category_id}`}>{category.name}:</label>
              <input className={'input'} id={`def-${category.category_id}`} type="text"
                     value={categoriesInput[category.category_id] ?? ''}
                     onChange={e => setCategoriesInput(v => ({...v, [category.category_id]: e.target.value}))}/>
            </div>
          })
        }
      </div>

      <div className={'block'}>
        <button className={'button is-primary'} onClick={handleSubmit}>Submit</button>
      </div>

      <i>Contexts (this doesn't do anything yet)</i>
      {contexts && contexts.map(context => <ContextCheckbox context={context}/>)}

      {reqSpelling && (<>
          <div className={'notification is-success'}>
            {reqSpelling}
          </div>
        </>
      )}
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
