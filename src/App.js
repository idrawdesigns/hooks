import React, { useReducer, useContext, useEffect, useRef } from 'react'

function appReducer(state, action) {
  switch (action.type) {
    case 'reset': {
      return action.payload
    }
    case 'ADD': {
      return [
        ...state,
        {
          id: Date.now(),
          text: '',
          completed: false
        }
      ]
    }
    case 'DELETE': {
      return state.filter(item => item.id !== action.payload)
    }

    case 'COMPLETED': {
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed
          }
        }
        return item
      })
    }

    default:
      return state
  }
}

const Context = React.createContext()

const App = () => {
  const [state, dispatch] = useReducer(appReducer, [])

  function useEfffectOnce(cb) {
    const didRun = useRef(false)

    useEffect(() => {
      if (!didRun.current) {
        cb()
        didRun.current = true
      }
    })
  }

  useEfffectOnce(() => {
    const raw = localStorage.getItem('data')
    dispatch({ type: 'reset', payload: JSON.parse(raw) })
  })

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(state))
  }, [state])

  return (
    <Context.Provider value={dispatch}>
      <div style={{ padding: '40px' }}>
        <h1>Todos App</h1>
        <button onClick={() => dispatch({ type: 'ADD' })}>New todo</button>
        <br />
        <br />
        <TodosList items={state} />
      </div>
    </Context.Provider>
  )
}

const TodosList = ({ items }) => {
  return items.map(item => <TodoItem key={item.id} {...item} />)
}

const TodoItem = ({ id, completed, text }) => {
  const dispatch = useContext(Context)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch({ type: 'COMPLETED', payload: id })}
      />
      <input type="text" defaultValue={text} />
      <button onClick={() => dispatch({ type: 'DELETE', payload: id })}>
        Delete
      </button>
    </div>
  )
}

export default App
