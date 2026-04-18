const savedTodos = localStorage.getItem("neural_tasks");

export const initialState = {
  todos: savedTodos ? JSON.parse(savedTodos) : [],
  inputValue: "",
  priority: "Low",
  searchQuery: "",
  filterPriority: "All",
  filterStatus: "All",
};

export function todoReducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_PRIORITY":
      return { ...state, filterPriority: action.payload };
    case "SET_FILTER_STATUS":
      return { ...state, filterStatus: action.payload };
    case "ADD_TODO":
      if (!state.inputValue.trim()) return state;
      return {
        ...state,
        todos: [
          {
            id: Date.now(),
            text: state.inputValue,
            priority: state.priority,
            status: "Not Started",
            isEditing: false,
          },
          ...state.todos,
        ],
        inputValue: "",
      };
    case "CHANGE_STATUS":
      const statusOrder = ["Not Started", "In Process", "Done"];
      return {
        ...state,
        todos: state.todos.map((t) => {
          if (t.id === action.payload) {
            const currentIndex = statusOrder.indexOf(t.status);
            const nextIndex = (currentIndex + 1) % statusOrder.length;
            return { ...t, status: statusOrder[nextIndex] };
          }
          return t;
        }),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
      };
    case "START_EDIT":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, isEditing: true } : t,
        ),
      };
    case "SAVE_EDIT":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...t, text: action.payload.text, isEditing: false }
            : t,
        ),
      };
    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((t) => t.status !== "Done"),
      };
    default:
      return state;
  }
}
