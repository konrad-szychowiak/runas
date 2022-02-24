import {useParams} from "react-router-dom";
import {useGetAsync} from "../../common/useAsyncState";
import {api, error$alert} from "../../common/api";
import React, {useEffect, useState} from "react";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {LeftRightCard} from "../../components/LeftRightCard";
import {DictionarySearch} from "../DictionarySearch";
import {Label} from "@primer/react";

export function GoBackButton() {
  return <>
    <button className={'button'} onClick={() => {
      window.history.back()
    }}>Go Back
    </button>
  </>
}

export function SemanticGroupUpdate() {
  const {group_id} = useParams();

  const {value, call: getValue} = useGetAsync(
    async () => {
      try {
        return (await api.get(`/group/${group_id}`)).data
      } catch (e) {
        error$alert(e);
      }
    }, {
      initialCall: true
    })

  const {value:lexemes, call: getLexeme} = useGetAsync(
    async () => {
      try {
        return (await api.get(`/group/${group_id}/lexeme`)).data
      } catch (e) {
        error$alert(e);
      }
    }, {
      initialCall: true
    })

  const [description, setDescription] = useState('')
  const [meaning, setMeaning] = useState('')
  const [selectedLexeme, setSelectedLexeme] = useState<number[]>([]);

  useEffect(()=>{
    setSelectedLexeme(lexemes?.map(lexeme=>lexeme.lexeme_id)??[]);
  }, [lexemes])

  useEffect(() => {
    setDescription(value?.description)
    setMeaning(value?.meaning)
  }, [value])

  const onUpdate = async () => {
    if (description === '' || meaning === '') {
      alert('Please input some values into both fields!')
      return;
    }
    try {
      const res = (await api.put(`/group/${group_id}/semantic/`, {meaning, description})).data;
      alert(JSON.stringify(res))
    } catch (e) {
      error$alert(e)
    } finally {
      // window.history.back();
    }
  }


  const onAssign = async () => {

    try {
      const res = (await api.put(`/group/${group_id}/lexeme`, {lexemes: selectedLexeme})).data;
      alert(JSON.stringify(res))
      getLexeme();
    } catch (e) {
      error$alert(e)
    } finally {
      // window.history.back();
    }
  }
  return <>
    <LeftRightCard noCard
                   left={<h1 className="title">New Semantic Group</h1>}
                   right={<GoBackButton/>}/>

    <div className={'card'}>
      <div className={'card-content'}>
        <ModifiableTextField initialValue={description} onValueChange={setDescription}
                             labelText={"Group's Description"}/>
        <ModifiableTextField initialValue={meaning} onValueChange={setMeaning} labelText={'Meaning'}/>




        {/*<Link to={'/design/pos/'}>*/}
        <button className={"button is-primary"} onClick={() => onUpdate()}>Update</button>
        {/*</Link>*/}
      </div>
    </div>
    <br/>
    <div className={'card'}>
      <div className={'card-content'}>

        <DictionarySearch current={selectedLexeme} onSearch={selected => {
          // fixme: delay in passing things
          setSelectedLexeme(selected)
          console.log(selectedLexeme)
        }}/>
        <br/>


        {/*<Link to={'/design/pos/'}>*/}
        <button className={"button is-primary"} onClick={() => onAssign()}>Assign</button>
        {/*</Link>*/}
      </div>
    </div>
  </>;
}