import React from "react";
import {useParams} from "react-router-dom";
import {LeftRightCard} from "../../components/LeftRightCard";
import {useGetAsync} from "../../common/useAsyncState";
import {api, error$alert} from "../../common/api";

export function GroupRead() {
  const {group_id} = useParams();

  const {value} = useGetAsync(async () => {
    try {
      return (await api.get(`/group/${group_id}`)).data
    } catch (e) {
      error$alert(e)
    }
  }, {
    initialCall: true
  })

  return <>
    <LeftRightCard noCard
                   left={<></>}
                   right={<></>}/>
    {group_id}
    <code>{JSON.stringify(value)}</code>
  </>
}