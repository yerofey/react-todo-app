import React, { useState, useCallback, useEffect } from 'react';
// shortid
import shortid from 'shortid';
// checkbox
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
// icons
import { IconContext } from 'react-icons';
import { FaTrash, FaArrowUp } from 'react-icons/fa';

const App = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useLocalStorage('list', []);

  const onNewTodoChange = useCallback((event) => {
    setNewTodo(event.target.value);
  }, []);

  const onNewTodoSubmit = useCallback((event) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      return;
    }

    // add new item
    setTodos([
      ...todos,
      {
        id: shortid.generate(),
        content: newTodo,
        done: false,
        timestamp: new Date()
      }
    ]);

    // reset input
    setNewTodo('');

    // scroll to bottom
    setTimeout(() => {
      const list = document.getElementById('list');
      list.scrollTop = list.scrollHeight - list.clientHeight;
    }, 1);
  }, [newTodo, todos, setTodos]);

  const changeTodo = useCallback((todo, index) => (event) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1, {
      ...todo,
      done: !todo.done
    });
    setTodos(newTodos);
  }, [todos, setTodos]);

  const deleteTodo = useCallback((todo) => (event) => {
    setTodos(todos.filter(item => item !== todo));
  }, [todos, setTodos]);

  const markAllDone = useCallback(() => {
    const newTodos = todos.map(item => {
      return {
        ...item,
        done: true
      };
    });
    setTodos(newTodos);
  }, [todos, setTodos]);

  const deleteAll = useCallback(() => {
    setTodos([]);
  }, [setTodos]);

  useEffect(() => {
    if (todos.length === 0) {
      document.getElementById('buttons').style.display = 'none';
      document.getElementById('message').style.display = 'block';
    } else {
      document.getElementById('buttons').style.display = 'block';
      document.getElementById('message').style.display = 'none';
    }

    window.localStorage.setItem('list', JSON.stringify(todos));
  }, [todos]);

  return (
    <div>
      <main>
        <div className="buttons" id="buttons" style={{'display': 'none'}}>
          <button className="done-button" id="checkAllButton" onClick={markAllDone}>
            <Checkbox
              checked
              onChange={() => {}}
              disabled={false}
            />
            <span>
              Check All
            </span>
          </button>
          <button className="delete-button" id="deleteAllButton" onClick={deleteAll}>
            <IconContext.Provider value={{ color: '#9a9a9a', size: '14px' }}>
              <FaTrash/>
            </IconContext.Provider>
            <span>
              Delete All
            </span>
          </button>
        </div>
        <div className="item-list" id="list">
          <div className="message" id="message" style={{'display': 'none'}}>
            You don't have any tasks yet :(
          </div>
          
          {todos.length !== 0 && todos.map((todo, index) => (
            <label className={'item' + (todo.done ? ' -done' : '')} htmlFor={'check-' + todo.id} key={todo.id}>
              <Checkbox
                id={'check-' + todo.id} 
                checked={todo.done}
                onChange={changeTodo(todo, index)}
              />
              <span className="content">
                {todo.content}
              </span>
              <button className="delete-button" onClick={deleteTodo(todo)}>
                <FaTrash/>
              </button>
            </label>
          ))}
        </div>
        <form className="todo-form" onSubmit={onNewTodoSubmit}>
          <div className="line">
            <input 
              id="newTodo"
              name="new-todo"
              value={newTodo} 
              onChange={onNewTodoChange}
              autoFocus
              autoComplete="off"
              placeholder="Add new task"
            />
            <button type="submit">
              <FaArrowUp/>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const appHeight = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
}
window.addEventListener('resize', appHeight);
appHeight();

export default App;
