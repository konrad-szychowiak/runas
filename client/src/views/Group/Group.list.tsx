import React from "react";
import {useGetAsync} from "../../common/useAsyncState";
import {Link} from "react-router-dom";
import {api, error$alert} from "../../common/api";
import {LeftRightCard} from "../../components/LeftRightCard";

enum Group {
  Morph = "morphological",
  Semantic = 'semantic'
}

const element = (groupSubtype) => (/* props */) => {

  const {value, call: getValue} = useGetAsync(
    async () => {
      try {
        const res = (await api.get(`/group/`)).data
        return res
          .filter(el => el.group_type == groupSubtype)
      } catch (e) {
        error$alert(e);
      }
    }, {
      initialCall: true
    })


  const onDelete = async id => {
    try {
      await api.delete(`/group/${id}`)
      getValue();
    } catch (e) {

    }
  }

  return (<>
    <div>
      <div className={'level'}>
        <div className="level-left">
          <span className="title">Groups ({groupSubtype})</span>
        </div>

        <div className="level-right">
          <Link to={`/design/group/${groupSubtype}/create`}>
            <button className="button is-info">Create New</button>
          </Link>
        </div>
      </div>

      {/*<code>{JSON.stringify(value)}</code>*/}

      {/*<hr/>*/}

      {value && value.map(el => <>
        <LeftRightCard
          left={<>
            <div>
              <p><strong>{el.description}</strong></p>
              <p><em>{el.meaning}</em></p>
            </div>
          </>}
          right={<>
            <Link to={`${el.id}`}>
              <button className="button is-primary mr-2">Edit</button>
            </Link>
            <button className="button is-danger" onClick={async () => await onDelete(el.id)}>Delete</button>
          </>}/>
      </>)}
    </div>
  </>)
}

export const MorphologicalGroup = element(Group.Morph);

export const SemanticGroup = element(Group.Semantic);