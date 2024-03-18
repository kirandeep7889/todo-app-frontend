import React, {useState} from 'react'
import axios from "axios";

export const EditTodoForm = ({editTodo, task}) => {
    const [value, setValue] = useState(task.title);

    const handleSubmit = (e) => {
        e.preventDefault();
        // edit todo
        if (value) {
          axios.put(`http://localhost:3000/api/v1/todo/${task._id}`, { 
              title: value
          })
          .then(response => {
              console.log("Todo updated successfully");
              setValue('');
              editTodo(value,task._id)
          })
          .catch(error => {
              console.error("Error updating todo:", error);
          });
      }
      };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder='Update task' />
    <button type="submit" className='todo-btn'>Edit Task</button>
  </form>
  )
}