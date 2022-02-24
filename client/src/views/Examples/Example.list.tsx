import React, {useState} from "react";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {LeftRightCard} from "../../components/LeftRightCard";
import {Link} from "react-router-dom";
import {ModifiableTextField} from "../../components/ModifiableTextField";
import {api, error$alert} from "../../common/api";

export function ExampleList() {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const {value, call: getValue} = useGetAsync(
    async () => (await axios.get(`http://localhost:8080/api/example/`)).data,
    {
      initialCall: true
    })

  const createUseExample = async () => {
    try {
      await api.post(`/example/`, {text, source})
    } catch (e) {
      error$alert(e)
    } finally {
      getValue();
    }
  }

  const deleteUseExample = async (id) => {
    await axios.delete(`http://localhost:8080/api/example/${id}`)
    getValue();
  }

  return <>
    <div>
      <LeftRightCard noCard
                     left={<div className="title">Use Examples</div>}
                     right={<></>}/>

      <article className="card message is-primary">
        <div className="message-header">
          <p>New Use Example</p>
        </div>
        <div className="message-body">
          <ModifiableTextField initialValue={text} onValueChange={setText} labelText={"Text"}/>
          <ModifiableTextField initialValue={source} onValueChange={setSource} labelText={"Source"}/>
          <button className="button is-primary"
                  onClick={() => createUseExample()}>Create
          </button>
        </div>
      </article>

      {value && value.map(el =>
        <>
          <LeftRightCard
            left={<>
              <div>
                <p><strong><q>{el.text}</q></strong></p>
                 <p>
                    from: {el.source_ref ? <code>{el.source_ref}</code> : <i>unknown</i>}
                </p>
                {/*<code>{JSON.stringify(el)}</code>*/}
              </div>
            </>}
            right={<>
              <Link to={`${el.example_id}`}>
                <button className="button is-primary mr-2">Edit</button>
              </Link>
              <button className="button is-danger"
                      onClick={() => deleteUseExample(el.example_id)}>Delete
              </button>
            </>}/>
        </>
      )}
    </div>
  </>
}