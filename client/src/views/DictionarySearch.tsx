import React from "react";
import axios from "axios";
import Select from "react-select";
import {useGetAsync} from "../common/useAsyncState";

const filterOptions = (options) => (inputValue: string) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

interface Props {

  onSearch?: (selected: number[]) => void;
  current?: number[];
}

export function DictionarySearch({onSearch, current}: Props) {
  const {value: options} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/lexeme/`)).data,
    {
      dependencies: [],
      initialCall: true
    })

  const mappedOptions = (options ?? []).map(el => ({value: el.lemma.toLowerCase(), label: el.lemma, id: el.id}))

  const currentValues = mappedOptions.filter(option => current.includes(option.id));

  const onChange = value => {
    onSearch(value.map(lexeme => lexeme.id))
  }

  if ((!options)) return <></>

  return (
    <div>
      <Select
        isMulti
        options={mappedOptions}
        value={currentValues}
        onChange={value => onChange(value)}
      />
    </div>
  );
}