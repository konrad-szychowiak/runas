import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom';
import {HashRouter, Route, Routes} from "react-router-dom";
import React from 'react';
import App from './App';
import './index.sass';
import {Lexeme} from "./views/LexemeWizard";
import {Design, PartsOfSpeech} from "./views/Design";
import {DictionaryView} from "./views/DictionaryView";
import {ContextList} from "./views/Context/Context.list";
import {POSUpdate} from "./views/PartOfSpeech/POS.update";
import {POSCreate} from "./views/PartOfSpeech/POS.create";
import {UseExamples} from "./views/UseExamples";
import {MorphologicalGroup, SemanticGroup} from "./views/Gropus";
import {LexemeUpdate} from "./views/LexemeWizard/Lexeme.update";
import {PartOfSpeech} from './views/PartOfSpeech';
import {Context} from './views/Context';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path={'/'} element={<App/>}>
        <Route path={''} element={<DictionaryView/>}/>
        <Route path={'wizard'} element={<Lexeme.Creator/>}/>
        <Route path={'design'} element={<Design/>}>
          <Route path={'pos'}>
            <Route path={''} element={<PartsOfSpeech/>}/>
            <Route path={'create'} element={<PartOfSpeech.Create/>}/>
            <Route path={':pos_id'} element={<PartOfSpeech.Update/>}/>
          </Route>
          <Route path={'context'} element={<Context.List/>}/>
          <Route path={'examples'} element={<UseExamples/>}/>
          <Route path={'group'}>
            <Route path={'m'} element={<MorphologicalGroup/>}/>
            <Route path={'s'} element={<SemanticGroup/>}/>
          </Route>
        </Route>
        <Route path={'lexeme'}>
          <Route path={':lexeme_id'}>
            <Route path={''} element={<Lexeme.Read/>}/>
            <Route path={'update'} element={<LexemeUpdate/>}/>
          </Route>
        </Route>

      </Route>
    </Routes>
  </HashRouter>
  , document.getElementById('root'));
