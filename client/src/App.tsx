import React from 'react';
import {Outlet} from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  const handleOnTabChange = (index: number) => {
  }

  return (
    <>
      <div className={'container'}>
        <NavBar/>
        <Outlet/>
      </div>
    </>
  );
}

export default App;