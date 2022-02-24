import React from "react";

export function LexemeUsages(props: { lexeme: any }) {
  return <>
    <h2 className={"subtitle"}>Use Examples</h2>

    <ul>
      {props.lexeme?.examples?.map(({text, source}) =>
        <>
          <li>
            <p>
              <q>{text}</q> <small>based on:</small> <span className={'tag is-small is-link is-light'}>{source}</span>
            </p>
          </li>
        </>
      )}
    </ul>
  </>;
}