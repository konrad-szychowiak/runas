import React, {useEffect, useState} from "react";
import {DictionarySearch} from "../DictionarySearch";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import {ModifiableTextField} from "../../components/ModifiableTextField";

export function ExampleEdit() {
  const {example_id: id} = useParams();
  const {value: example} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/example/${id}`)).data,
    {
      dependencies: [id],
      initialCall: true
    })
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [lexemes, setLexemes] = useState([]);

  useEffect(() => {
    setText(example?.text)
    setSource(example?.source_ref)
  }, [example])

  console.log(example)

  return <>
    <ModifiableTextField initialValue={text} onValueChange={setText} labelText={'Example content (text)'}/>

    <ModifiableTextField initialValue={source} onValueChange={setSource} labelText={'Source of this example'}/>

    <h2 className="subtitle">Assign lexemes to this example</h2>

    <pre>{JSON.stringify(example?.usage)}</pre>

    <DictionarySearch onSearch={selected => setLexemes(selected)}/>
    <button className={'button'} onClick={() => {
      lexemes.forEach(lexeme => {
        axios.post(`http://localhost:8080/api/lexeme/${lexeme.id}/example/${id}`)
      })
    }}>Assign</button>
  </>
}