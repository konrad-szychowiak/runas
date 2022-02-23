import {ContextSchema} from "./schemas";
import React, {useEffect, useState} from "react";
import {LeftRightCard} from "../../components/LeftRightCard";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {api} from "../../common/api";

export function ContextUpdate({
                                context,
                                onSave,
                                onDelete
                              }: { context: ContextSchema, onSave: (value) => void, onDelete: (context) => void }) {
  const {context_id: id, name, description: origDescription} = context

  const [text, setText] = useState(name);
  const [description, setDescription] = useState(origDescription);

  // useEffect(() => {
  //   setText(name)
  //   setDescription(origDescription)
  // }, [context])
  //

  const save = async () => {

    const res = (await api.put('/context', {id, description, name: text})).data
    alert(JSON.stringify(res))

    onSave(res)
  }

  const del = async () => {
    onDelete(context)
  }

  return <>
    <LeftRightCard
      left={<>
        <div style={{display: "flex", flexDirection: 'row', gap: '.5em'}}>
          <ModifiableTextField initialValue={text} onValueChange={setText} labelText={'Name'}/>
          <ModifiableTextField initialValue={description} onValueChange={setDescription} labelText={'Description'}/>
        </div>
      </>
      }
      right={
        <>
          <button className={'button mr-2'}
                  onClick={save}>Save Changes
          </button>
          <button className={'button is-danger'}
                  onClick={del}>{'Delete'}</button>
        </>
      }/>
  </>
}