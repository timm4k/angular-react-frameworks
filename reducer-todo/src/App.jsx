import { useReducer, useEffect } from "react";
import { todoReducer, initialState } from "./todoReducer";
import "./App.css";

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    localStorage.setItem("neural_tasks", JSON.stringify(state.todos));
  }, [state.todos]);

  const filtered = state.todos.filter((t) => {
    const search = t.text
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase());

    const priority =
      state.filterPriority.toLowerCase() === "all" ||
      t.priority.toLowerCase() === state.filterPriority.toLowerCase();

    const status =
      state.filterStatus.toLowerCase() === "all" ||
      t.status.toLowerCase() === state.filterStatus.toLowerCase();

    return search && priority && status;
  });

  const progress =
    state.todos.length > 0
      ? (state.todos.filter((t) => t.status === "Done").length /
          state.todos.length) *
        100
      : 0;

  const getCSSClass = (str) => str.replace(/\s+/g, ".");

  return (
    <div className="main-panel">
      <div className="progress-line" style={{ width: `${progress}%` }} />

      <div className="content">
        <h1>Task tracker</h1>

        <input
          style={{ width: "100%", marginBottom: "10px" }}
          placeholder="Search..."
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
        />

        <div className="action-bar">
          <input
            style={{ flex: 1 }}
            value={state.inputValue}
            placeholder="Name task"
            onChange={(e) =>
              dispatch({ type: "SET_INPUT", payload: e.target.value })
            }
            onKeyDown={(e) =>
              e.key === "Enter" && dispatch({ type: "ADD_TODO" })
            }
          />
          <select
            value={state.priority}
            onChange={(e) =>
              dispatch({ type: "SET_PRIORITY", payload: e.target.value })
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            className="btn-add"
            onClick={() => dispatch({ type: "ADD_TODO" })}
          >
            ADD
          </button>
        </div>

        <div className="filter-group">
          <div className="filter-row">
            {["all", "not started", "in process", "done"].map((s) => (
              <span
                key={s}
                className={state.filterStatus === s ? "active" : ""}
                onClick={() =>
                  dispatch({ type: "SET_FILTER_STATUS", payload: s })
                }
              >
                {s}
              </span>
            ))}
          </div>
          <div className="filter-row">
            {["all", "low", "medium", "high"].map((p) => (
              <span
                key={p}
                className={state.filterPriority === p ? "active" : ""}
                onClick={() =>
                  dispatch({ type: "SET_FILTER_PRIORITY", payload: p })
                }
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="scroll-area">
          {filtered.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div style={{ flex: 1 }}>
                <span className={`priority-label ${todo.priority}`}>
                  {todo.priority} Priority
                </span>
                {todo.isEditing ? (
                  <input
                    className="edit-input"
                    defaultValue={todo.text}
                    autoFocus
                    onBlur={(e) =>
                      dispatch({
                        type: "SAVE_EDIT",
                        payload: { id: todo.id, text: e.target.value },
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      dispatch({
                        type: "SAVE_EDIT",
                        payload: { id: todo.id, text: e.target.value },
                      })
                    }
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={`status-tag ${getCSSClass(todo.status)}`}
                      onClick={() =>
                        dispatch({ type: "CHANGE_STATUS", payload: todo.id })
                      }
                    >
                      {todo.status}
                    </span>
                    <span
                      className={`task-text ${todo.status === "Done" ? "Done" : ""}`}
                      onClick={() =>
                        dispatch({ type: "CHANGE_STATUS", payload: todo.id })
                      }
                    >
                      {todo.text}
                    </span>
                  </div>
                )}
              </div>
              <button
                className="btn-icon"
                onClick={() =>
                  dispatch({ type: "START_EDIT", payload: todo.id })
                }
              >
                ✎
              </button>
              <button
                className="btn-icon"
                onClick={() =>
                  dispatch({ type: "DELETE_TODO", payload: todo.id })
                }
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {state.todos.some((t) => t.status === "Done") && (
          <button
            className="purge-btn"
            onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}
          >
            Clear Finished Missions
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
