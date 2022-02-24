import React from "react";

export function LeftRightCard(props: { left: JSX.Element, right: JSX.Element, noCard?: boolean }) {
  const {left, right, noCard} = props;

  const level = <>
    <div className="level">
      <div className="level-left">
        {left}
      </div>
      <div className="level-right">
        {right}
      </div>
    </div>
  </>

  if (noCard) return level;

    return <>
      <div className="card mb-4">
        <div className="card-content ">
          {level}
        </div>
      </div>
    </>
}