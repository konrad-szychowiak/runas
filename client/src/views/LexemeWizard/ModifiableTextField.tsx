import React, {useEffect, useState} from "react";

type ModifiableTextFieldProps = { initialValue: string, onValueChange: (value) => void, labelText?: string, noLabel?: boolean }
export function ModifiableTextField({
                                      initialValue,
                                      onValueChange,
                                      labelText = 'Lemma (dictionary form)',
                                      noLabel = false
                                    }: ModifiableTextFieldProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onChange = event => {
    const value = event.target.value
    setValue(value)
    onValueChange(value)
  }

  return <>
    <div className={'field block'}>
      {!noLabel && <label className={'label'} htmlFor="lemma">{labelText}</label>}
      <input className={'input'} type="text" value={value} onChange={onChange}/>
    </div>
  </>
}