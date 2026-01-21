
import { useTodo } from '../context/TodoContext';

const TodoList = () => {
  const { todos, isLoading, error, toggleTodo, deleteTodo } = useTodo();

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">My Todo List</h2>
      
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li 
            key={todo.id} 
            className="flex items-center justify-between p-3 bg-white border rounded shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 cursor-pointer"
              />
              <span 
                className={`truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                title={todo.title}
              >
                {todo.title}
              </span>
            </div>

            <button 
              onClick={() => deleteTodo(todo.id)}
              className="ml-2 px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;