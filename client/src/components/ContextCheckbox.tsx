import React, {useState} from "react";

export function ContextCheckbox(props: { lexeme?: number, context: any, onAdd: Function, onRemove: Function }) {
  const [checked, setChecked] = useState(false)

  const toggleContext = () => {
    console.log(props.context)
    if (!checked) {
      props.onAdd(props.context.context_id)
    } else {
      props.onRemove(props.context.context_id)
    }
  }

  return <div className={'m-2'}>
    <label className="checkbox">
      <input type="checkbox"
             checked={checked}
             onChange={event => {
               setChecked(event.target.checked);
               toggleContext();
             }}
             className={'mr-2'}
      />

      {checked ? <strong>{props.context.name}</strong> : <s>{props.context.name}</s>} {props.context.description ?? ""}
    </label>
  </div>;
}