
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newTitle: string) => void;
}