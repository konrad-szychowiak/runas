import axios from "axios";

export function error$alert(error) {
  alert('An error occurred whilst handling your request, please check the correctness of the data and try again. ' +
    'If the problem persists, please contact the administrator.')
  console.error(error)
}

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
})
