import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom';
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import React from 'react';
import App from './App';
import './index.sass';
import Home from "./views/Home";
import Wizard from "./views/Wizard";
import {Design, PartsOfSpeech, POSAdder} from "./views/Design";
import {DictionaryView} from "./views/DictionaryView";
import {Lexeme} from "./views/Lexeme";
import {Contexts} from "./views/Contexts";

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path={'/'} element={<App/>}>
        <Route path={''} element={<DictionaryView/>}/>
        <Route path={'wizard'} element={<Wizard/>}/>
        <Route path={'design'} element={<Design/>}>
          <Route path={'pos'} >
            <Route path={''} element={<PartsOfSpeech/>}/>
            <Route path={'create'} element={<POSAdder/>}/>
            <Route path={':pos_id'} element={<POSAdder/>}/>
          </Route>
          <Route path={'context'} element={<Contexts/>}/>
        </Route>
        <Route path={'lexeme'}>
          <Route path={':lexeme_id'} element={<Lexeme/>}/>
        </Route>
      </Route>
    </Routes>
  </HashRouter>
  , document.getElementById('root'));
