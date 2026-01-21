// src/context/TodoContext.tsx

import { createContext, useContext, useState, useEffect } from 'react';

import type { ReactNode } from 'react';
import type { Todo, TodoContextType } from '../types/todo';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}?_limit=10`);
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    const newTodo: Todo = {
      id: Date.now(), 
      title,
      completed: false,
      userId: 1
    };

    setTodos((prev) => [newTodo, ...prev]); 

    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
    } catch (err) {
      setTodos((prev) => prev.filter((t) => t.id !== newTodo.id));
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id: number) => {
    // หาตัวที่จะแก้ เพื่อดูค่าเดิม
    const todoToToggle = todos.find(t => t.id === id);
    if (!todoToToggle) return;

    // Optimistic Update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH', // หรือ PUT
        body: JSON.stringify({ completed: !todoToToggle.completed }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
    } catch (err) {
      setError('Failed to update todo');
      // Rollback logic could go here
    }
  };

  const deleteTodo = async (id: number) => {
    // Optimistic Update: ลบออกจากจอทันที
    setTodos(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      setError('Failed to delete todo');
      // Rollback logic could go here
    }
  };

  const editTodo = async (id: number, newTitle: string) => {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
      try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: newTitle }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
      } catch (err) {
        setError('Failed to edit todo');
      }
  }

  return (
    <TodoContext.Provider value={{ todos, isLoading, error, addTodo, toggleTodo, deleteTodo, editTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used within a TodoProvider');
  return context;
};