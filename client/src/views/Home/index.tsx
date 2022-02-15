import React, {useState} from 'react';
import Wizard from "../Wizard";
import {DictionaryView} from "../DictionaryView";
import {Design} from "../Design";

const Home = () => {
  const [view, setView] = useState('list')
  return (
    <div>
      <DictionaryView />
    </div>
  );
};

export default Home;