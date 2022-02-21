import React from "react";

export function LexemeUsages(props: { lexeme: any }) {
  return <>
    <h2 className={"subtitle"}>Use Examples</h2>

    <ul>
      {props.lexeme?.examples?.map(({text, source}) =>
        <>
          <li>
            <q>{text}</q>
            <a href={source}>{source}</a>
          </li>
        </>
      )}
    </ul>
  </>;
}