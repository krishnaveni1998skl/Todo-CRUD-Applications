import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add and Update Todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          title,
          description,
        });
        setEditId(null);
      } else {
        await axios.post(API_URL, {
          title,
          description,
        });
      }

      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Edit Todo
  const editTodo = (todo) => {
    setEditId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description || "");
  };

  // Toggle Completed
  const toggleTodo = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>My Todo App</h1>
        <p className="subtitle">Manage your daily tasks</p>

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Enter todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit">{editId ? "Update Todo" : "Add Todo"}</button>
        </form>

        <h2>My Tasks ({todos.length})</h2>

        {todos.length === 0 ? (
          <p className="empty">No todos found. Add your first task!</p>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <div className="todo-card" key={todo.id}>
                <div>
                  <h3 className={todo.completed ? "completed" : ""}>
                    {todo.title}
                  </h3>
                  <p>{todo.description}</p>
                  <span className={todo.completed ? "done" : "pending"}>
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="actions">
                  <button onClick={() => toggleTodo(todo)}>
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                  <button onClick={() => editTodo(todo)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
