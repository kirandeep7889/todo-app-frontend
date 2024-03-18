import React, { useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/todo/bulk")
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const addTodo = (todoText) => {
    const newTodo = {
      title: todoText,
      completed: false,
      isEditing: false
    };

    axios.post("http://localhost:3000/api/v1/todo", newTodo)
      .then(response => {
        setTodos([...todos, response.data]);
      })
      .catch(error => {
        console.error("Error adding todo:", error);
      });
  }

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/api/v1/todo/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch(error => {
        console.error("Error deleting todo:", error);
      });
  }

  const toggleComplete = (id) => {
    const todo = todos.find((todo) => todo._id === id);
  
    if (todo) {
      axios.put(`http://localhost:3000/api/v1/todo/${id}/toggle`)
        .then(() => {
          setTodos(
            todos.map((todo) =>
              todo._id === id ? { ...todo, completed: !todo.completed } : todo
            )
          );
        })
        .catch((error) => {
          console.error("Error toggling todo completion:", error);
        });
    } else {
      console.error("Todo not found with ID:", id);
    }
  };
  
  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  }

  const editTask = (task, id) => {
    setTodos(todos.map((todo) =>
      todo._id === id ? { ...todo, title: task, isEditing: false } : todo
    ));
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm key={todo._id} editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo._id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
