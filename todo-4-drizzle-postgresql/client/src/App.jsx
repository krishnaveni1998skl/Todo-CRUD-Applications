import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5003/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const todoData = {
        title: title.trim(),
        description,
        completed:
          editingId !== null
            ? (todos.find((todo) => todo.id === editingId)?.completed ?? false)
            : false,
      };

      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, todoData);
      } else {
        await axios.post(API_URL, todoData);
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
      fetchTodos();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description || "");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>Todo Application</h1>
        <p className="subtitle">React + Drizzle + PostgreSQL</p>

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

          <button type="submit">
            {editingId !== null ? "Update Todo" : "Add Todo"}
          </button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty">No todos available</p>
          ) : (
            todos.map((todo) => (
              <div className="todo-card" key={todo.id}>
                <div>
                  <h3 className={todo.completed ? "completed" : ""}>
                    {todo.title}
                  </h3>
                  <p>{todo.description}</p>
                  <span>{todo.completed ? "Completed" : "Pending"}</span>
                </div>

                <div className="actions">
                  <button onClick={() => handleToggle(todo)}>
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                  <button onClick={() => handleEdit(todo)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
