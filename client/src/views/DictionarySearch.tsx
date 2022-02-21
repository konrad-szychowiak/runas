import React, {useEffect, useState} from "react";

import AsyncSelect from 'react-select/async';
import axios from "axios";
import Select from "react-select";
import {useGetAsync} from "../common/useAsyncState";

const filterOptions = (options) => (inputValue: string) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

export function DictionarySearch({onSearch}: { onSearch?: Function }) {
  const {value: options} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/lexeme/`)).data,
    {
      dependencies: [],
      initialCall: true
    })

  const [selected, setSelected] = useState<readonly string[]>([]);

  const onChange = value => {
    setSelected(value);
    onSearch(value)
  }

  if ((!options)) return <></>

  return (
    <div>
      {/*<pre>{JSON.stringify(selected)}</pre>*/}
      <Select
        isMulti
        options={options
          .map(el => ({value: el.lemma.toLowerCase(), label: el.lemma, id: el.id}))}
        value={selected}
        onChange={value => onChange(value)}
      />
    </div>
  );
}