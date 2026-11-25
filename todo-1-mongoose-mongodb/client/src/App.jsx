import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get All Todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Load Todos
  useEffect(() => {
    fetchTodos();
  }, []);

  // Add and Update Todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a todo title");
      return;
    }

    const todoData = {
      title,
      description,
    };

    try {
      setLoading(true);

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, todoData);
        alert("Todo updated successfully");
      } else {
        await axios.post(API_URL, todoData);
        alert("Todo added successfully");
      }

      setTitle("");
      setDescription("");
      setEditId(null);

      fetchTodos();
    } catch (error) {
      console.error("Error saving todo:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Edit Todo
  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditId(todo._id);
  };

  // Delete Todo
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Todo deleted successfully");
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Unable to delete todo");
    }
  };

  // Toggle Completed Status
  const handleToggle = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo._id}`, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });

      fetchTodos();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setEditId(null);
  };

  return (
    <div className="app-container">
      <h1>Todo Application</h1>
      <p className="subtitle">Manage your daily tasks easily</p>

      {/* Todo Form */}
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter todo description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : editId ? "Update Todo" : "Add Todo"}
          </button>

          {editId && (
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Todo List */}
      <div className="todo-list">
        <h2>My Tasks ({todos.length})</h2>

        {todos.length === 0 ? (
          <p className="empty-message">
            No todos available. Add your first task!
          </p>
        ) : (
          todos.map((todo) => (
            <div className="todo-card" key={todo._id}>
              <div className="todo-content">
                <h3 className={todo.completed ? "completed" : ""}>
                  {todo.title}
                </h3>

                <p>{todo.description}</p>

                <label className="status">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  Completed
                </label>
              </div>

              <div className="todo-actions">
                <button className="edit-btn" onClick={() => handleEdit(todo)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(todo._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
