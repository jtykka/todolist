import React, { useState, useEffect } from 'react'
import service from './services/service.js' 
import './App.css'

const TodoList = ({todolist, handleDone, handleDelete}) => {

  return todolist.map( x => <tr key={x.id} className={x.done ? "item_done" : "item_normal"}><td>{x.title}</td><td><button onClick={handleDone(x)}>{x.done ? "mark as undone" : "mark as done"}</button></td><td><button onClick={handleDelete(x.id)}>delete</button></td></tr> )
}

const SubmitForm = (props) => {

  return (
    <form>
    <div>
      <input  value={props.newTitle} onChange={props.handleTitleChange} />
    </div>
    <div>
      <button onClick={props.handleSubmit} type="submit">Add</button>
    </div>
    </form>
  )
}

const Notification = ({ notification }) => {
  if (notification === null || notification.string === null) {
    return null
  }

  return (
    <div className={notification.isError ? "notification_error" : "notification_normal" }>
      {notification.string}
    </div>
  )
}

const App = () => {
  const [ todoList, setTodoList] = useState([]) 
  const [ newTitle, setNewTitle ] = useState('')
  const [ notification, setNotification] = useState({string: null, isError: false})

  useEffect(() => {
      service.getAll().then(x => setTodoList(x)) 
  }, [])

  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    let newObj = { title: newTitle }
    service.create(newObj)
      .then( x => { 
        setTodoList( todoList.concat(x) ) 
        setNotification( { string:`Added new item to todo list '${newTitle}'`, isError: false} )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        })
      .catch(error => {
        console.log(error.response.data)
        setNotification( {string: error.response.data, isError: true } )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleDelete = (id) => () => {
    console.log("delete " + id)
    service.remove(id).then(x => setTodoList( todoList.filter( y => y.id !== id) ))
  }

  const handleDone = (item) => () => {
    item.done = !item.done
    console.log("update " + item)
    service.update(item).then(  x => {
      let tmp = todoList.slice()
      let index = tmp.findIndex(y => y.id === x.id)
      tmp.splice(index, 1, item)
      setTodoList(tmp)
    })
  }

  return (
    <div>
      <h2>Add new item to TODO list</h2>
      <Notification notification={notification} />
      <SubmitForm newTitle={newTitle} handleTitleChange={handleTitleChange} handleSubmit={handleSubmit} />
      <br></br>
      <h2>My TODO list</h2>
      <table>
        <TodoList todolist={todoList} handleDone={handleDone} handleDelete={handleDelete} />
      </table>
    </div>
  )

}

export default App
