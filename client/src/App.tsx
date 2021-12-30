import React from 'react';
import { VechaiProvider } from "@vechaiui/react";
import {HashRouter, Routes, Route} from "react-router-dom";
import Home from "./views/Home";
import NavBar from "./components/NavBar";

function App() {
  const handleOnTabChange = (index:number)=>{

  }



  return (
    <VechaiProvider>
      <NavBar onChange={handleOnTabChange}/>
      <HashRouter>
        <Routes>
          <Route path={'/'} element={<Home/>}/>
        </Routes>
      </HashRouter>
    </VechaiProvider>
  );
}

export default App;