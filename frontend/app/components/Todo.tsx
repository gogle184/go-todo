import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTodo,
        completed: false,
      }),
    });
    const todo = await response.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="新しいTODOを入力"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          追加
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {/* TODO: 完了状態の更新処理 */}}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
