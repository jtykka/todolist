import axios from 'axios'

const baseUrl = '/api/todolist'

const getAll = () => {

    const x = axios.get(baseUrl)
    return x.then(response => response.data)
}

const create = newObj => {
    const x = axios.post(baseUrl, newObj)
    return x.then(response => response.data)
}

const remove = id => {
    const x = axios.delete(baseUrl + "/" + id)
    return x.then(response => response.data)
}

const update = newObj => {
    const x = axios.put(baseUrl + "/" + newObj.id, newObj)
    return x.then(response => response.data)
}
export default { 
    getAll: getAll, 
    create: create, 
    remove: remove,
    update: update
}


