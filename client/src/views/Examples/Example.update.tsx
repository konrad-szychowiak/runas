import React, {useEffect, useState} from "react";
import {DictionarySearch} from "../DictionarySearch";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {api} from "../../common/api";
import {LeftRightCard} from "../../components/LeftRightCard";
import {GoBackButton} from "../Group/SemanticGroup.update";

export function ExampleUpdate() {
  const {example_id: id} = useParams();
  const {value: example, call: getExample} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/example/${id}`)).data,
    {
      dependencies: [id],
      initialCall: true
    })
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [lexemes, setLexemes] = useState<number[]>([]);

  useEffect(() => {
    setText(example?.text)
    setSource(example?.source_ref)
    setLexemes(example?.usage.map(usage => usage.lexeme) ?? [])
  }, [example])

  const onUpdate = async () => {

  }

  return <>

    <LeftRightCard noCard
                   left={<h1 className={'title'}>Modify Use Example</h1>}
                   right={<><GoBackButton/></>}/>


    <div className={'card'}>
      <div className="card-content">
        <ModifiableTextField initialValue={text} onValueChange={setText} labelText={'Example content (text)'}/>
        <ModifiableTextField initialValue={source} onValueChange={setSource} labelText={'Source of this example'}/>
        <button className="button is-primary"
                onClick={async () => await onUpdate()}>Update
        </button>
      </div>
    </div>

    <div className="subtitle my-5">
      Assign lexemes to this example
    </div>

    <div className="card">
      <div className="card-content">
        <DictionarySearch current={lexemes} onSearch={selected => setLexemes(selected)}/>

        <button className={'button is-primary mt-3'} onClick={async () => {
          await api.post(`/example/${id}/assign`, {lexemes: lexemes})
          getExample()
        }}>Assign
        </button>
      </div>
    </div>


  </>
}