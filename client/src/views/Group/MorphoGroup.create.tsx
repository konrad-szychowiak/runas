import React, {useState} from "react";
import {api, error$alert} from "../../common/api";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {LeftRightCard} from "../../components/LeftRightCard";
import {useGetAsync} from "../../common/useAsyncState";
import Select from "react-select";


export function MorphoGroupCreate() {
  const [description, setDescription] = useState('')
  const [core, setCore] = useState<number>(-1)

  const onCreate = async () => {
    if (
      description === ''
      || core === -1
    ) {
      alert('Please input some values into both fields!')
      return;
    }
    try {
      const res = (await api.post(`/group/morphological/`, {
        core,
        description
      })).data;
      console.log(res)
    } catch (e) {
      error$alert(e)
    } finally {
      // window.history.back();
    }
  }

  const {value: options} = useGetAsync(
    async () => {
      try {
        return (await api.get(`/lexeme/`)).data
      } catch (e) {
        error$alert(e)
      }
    },
    {
      dependencies: [],
      initialCall: true
    })

  const presentable = (el) => ({
    value: el.lemma,
    label: <span>
      <b>{el.lemma}</b>  [{el.pos}] <i>{el.definition}</i>
    </span>,
    id: el.id,
  })

  return <>
    <LeftRightCard noCard
                   left={<h1 className="title">New Morphological Group</h1>}
                   right={<button className={'button'} onClick={() => {
                     window.history.back()
                   }}>Go Back</button>}/>

    <div className={'card'}>
      <div className={'card-content'}>
        <ModifiableTextField initialValue={description} onValueChange={setDescription}
                             labelText={"Group's Description"}/>

        <div className="field block">
          <span className="label">Core Lexeme</span>
          <Select
            options={options?.map(presentable)}
            onChange={(value: any) => {
              console.log(value)
              setCore(value.id)
            }}
          />
        </div>

        {/*<Link to={'/design/pos/'}>*/}
        <button className={"button is-primary"} onClick={() => onCreate()}>Create</button>
        {/*</Link>*/}
      </div>
    </div>

  </>;
}