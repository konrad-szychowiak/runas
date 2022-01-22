import React, {useState} from 'react';
import Wizard from "../Wizard";
import {DictionaryView} from "../DictionaryView";
import {Design} from "../Design";

const Home = () => {
  const [view, setView] = useState('list')
  return (
    <div>
      <button className={'button is-info is-small'} onClick={() => setView('create')}>create</button>
      <button className={'button is-info is-small'} onClick={() => setView('list')}>list</button>
      <button className={'button is-info is-small'} onClick={() => setView('design')}>design</button>
      { view === 'create' && <Wizard /> }
      { view === 'list' && <DictionaryView /> }
      { view === 'design' && <Design /> }
    </div>
  );
};

export default Home;