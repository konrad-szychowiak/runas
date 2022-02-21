import React, {useState} from 'react';
import {DictionaryView} from "../DictionaryView";

const Home = () => {
  const [view, setView] = useState('list')
  return (
    <div>
      <DictionaryView/>
    </div>
  );
};

export default Home;