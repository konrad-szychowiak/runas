import {ContextSchema} from "./schemas";
import React, {useState} from "react";
import {LeftRightCard} from "../../components/LeftRightCard";
import {ModifiableTextField} from "../../components/ModifiableTextField";

export function ContextUpdate({
                                context,
                                onSave,
                                onDelete
                              }: { context: ContextSchema, onSave: (value) => void, onDelete: (context) => void }) {
  const {name} = context

  const [text, setText] = useState(name);


  const save = () => {
    alert('TODO')
    onSave(text)
  }

  const del = async () => {
    onDelete(context)
  }

  return <>
    <LeftRightCard
      left={
        <ModifiableTextField initialValue={name} onValueChange={setText} noLabel/>
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