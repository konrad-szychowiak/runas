import React from 'react';
import {Tab} from '@headlessui/react'
import {Icon} from "@vechaiui/react";

interface Props {
  onChange:(index:number)=>void
}

function NavBar(props:Props) {



  return (
    <div className={"flex flex-wrap w-full p-8 space-x-4"}>
      <Tab.Group onChange={props.onChange}>
        <Tab.List>
          <Tab key={0} value={0}>
              <span>Home</span>
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default NavBar;