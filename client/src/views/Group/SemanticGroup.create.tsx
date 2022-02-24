import React, {useState} from "react";
import {api, error$alert} from "../../common/api";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {LeftRightCard} from "../../components/LeftRightCard";


export function SemanticGroupCreate() {
  const [description, setDescription] = useState('')
  const [meaning, setMeaning] = useState('')

  const onCreate = async () => {
    if (description === '' || meaning === '') {
      alert('Please input some values into both fields!')
      return;
    }
    try {
      const res = (await api.post(`/group/semantic/`, {meaning, description})).data;
      console.log(res)
    } catch (e) {
      error$alert(e)
    } finally {
      window.history.back();
    }
  }

  return <>
    <LeftRightCard noCard
                   left={<h1 className="title">New Semantic Group</h1>}
                   right={<button className={'button'} onClick={() => {
                     window.history.back()
                   }}>Go Back</button>}/>

    <div className={'card'}>
      <div className={'card-content'}>
        <ModifiableTextField initialValue={description} onValueChange={setDescription}
                             labelText={"Group's Description"}/>
        <ModifiableTextField initialValue={meaning} onValueChange={setMeaning} labelText={'Meaning'}/>
        {/*<Link to={'/design/pos/'}>*/}
        <button className={"button is-primary"} onClick={() => onCreate()}>Create</button>
        {/*</Link>*/}
      </div>
    </div>

  </>;
}