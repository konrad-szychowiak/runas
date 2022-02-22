import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom';
import {HashRouter, Route, Routes} from "react-router-dom";
import React from 'react';
import App from './App';
import './index.sass';
import {Lexeme} from "./views/Lexeme";
import {Design, DesignInfo} from "./views/Design";
import {DictionaryView} from "./views/DictionaryView";
import {ExampleList} from "./views/Examples/Example.list";
import {MorphologicalGroup, SemanticGroup} from "./views/Gropus";
import {LexemeUpdate} from "./views/Lexeme/Lexeme.update";
import {PartOfSpeech} from './views/PartOfSpeech';
import {Context} from './views/Context';
import {POSList} from "./views/PartOfSpeech/POS.list";
import {UseExample} from './views/Examples';

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path={'/'} element={<App/>}>
        <Route path={''} element={<DictionaryView/>}/>
        <Route path={'wizard'} element={<Lexeme.Creator/>}/>
        <Route path={'design'} element={<Design/>}>
          <Route path={''} element={<DesignInfo/>}/>
          <Route path={'pos'}>
            <Route path={''} element={<POSList/>}/>
            <Route path={'create'} element={<PartOfSpeech.Create/>}/>
            <Route path={':pos_id'} element={<PartOfSpeech.Update/>}/>
          </Route>
          <Route path={'context'} element={<Context.List/>}/>
          <Route path={'examples'}>
            <Route path={''} element={<UseExample.List/>}/>
            <Route path={':example_id'} element={<UseExample.Edit />} />
          </Route>
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
