import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom';
import {HashRouter, Route, Routes} from "react-router-dom";
import React from 'react';
import App from './App';
import './index.sass';
import Wizard from "./views/Wizard";
import {Design, PartsOfSpeech} from "./views/Design";
import {DictionaryView} from "./views/DictionaryView";
import {Lexeme} from "./views/Lexeme";
import {Contexts} from "./views/Contexts";
import {POSWizard} from "./views/POSWizard";
import {POSAdder} from "./views/POSAdder";
import {UseExamples} from "./views/UseExamples";
import {MorphologicalGroup, SemanticGroup} from "./views/Gropus";

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path={'/'} element={<App/>}>
        <Route path={''} element={<DictionaryView/>}/>
        <Route path={'wizard'} element={<Wizard/>}/>
        <Route path={'design'} element={<Design/>}>
          <Route path={'pos'}>
            <Route path={''} element={<PartsOfSpeech/>}/>
            <Route path={'create'} element={<POSAdder/>}/>
            <Route path={':pos_id'} element={<POSWizard/>}/>
          </Route>
          <Route path={'context'} element={<Contexts/>}/>
          <Route path={'examples'} element={<UseExamples/>}/>
          <Route path={'group'}>
            <Route path={'m'} element={<MorphologicalGroup/>}/>
            <Route path={'s'} element={<SemanticGroup/>}/>
          </Route>
        </Route>
        <Route path={'lexeme'}>
          <Route path={':lexeme_id'} element={<Lexeme/>}/>
        </Route>

      </Route>
    </Routes>
  </HashRouter>
  , document.getElementById('root'));
