import React, {useState} from "react";
import {useGetAsync} from "../../common/useAsyncState";
import axios from "axios";
import {LeftRightCard} from "../../components/LeftRightCard";
import {Link} from "react-router-dom";

export function ExampleList() {
  const [text, setText] = useState('');
  const {
    value,
    call: getValue
  } = useGetAsync(async () => (await axios.get(`http://localhost:8080/api/example/`)).data, {
    dependencies: [],
    initialCall: true
  })

  const createUseExample = async () => {
    await axios.post(`http://localhost:8080/api/example/`, {text})
    getValue();
  }

  const deleteUseExample = async (id) => {
    await axios.delete(`http://localhost:8080/api/example/${id}`)
    getValue();
  }

  return <>
    <div>
      <div className="level">
        <div className="level-left">
          <div className="title">Use Examples</div>
        </div>
        <div className="level-right">
          <button className="button is-info"
                  onClick={() => createUseExample()}>Create
          </button>
        </div>
      </div>

      <textarea name="" id="" rows={2} className="textarea mb-4" value={text}
                onChange={event => setText(event.target.value)}/>

      {value && value.map(el =>
        <>
          <LeftRightCard
            left={<>${el.example_id} {JSON.stringify(el)}</>}
            right={<>
              <Link to={`${el.example_id}`}>
                <button className="button is-primary mr-2">Edit</button>
              </Link>
              <button className="button is-danger"
                      onClick={() => deleteUseExample(el.example_id)}>Delete
              </button>
            </>}/>

          <div className="message">



          </div>
        </>
      )}
    </div>
  </>
}

