import React from "react";

export function LeftRightCard(props: { left: JSX.Element, right: JSX.Element }) {
  const {left, right} = props;
  return <>
    <div className="card mb-4">
      <div className="card-content ">
        <div className="level">
          <div className="level-left">
            {left}
          </div>
          <div className="level-right">
            {right}
          </div>
        </div>
      </div>
    </div>
  </>
}