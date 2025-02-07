import { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onompletedCanage: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TodoList = ({ todos, onompletedCanage, onDelete }: TodoListProps) => {
    const todoSorted= todos.sort((a,b) =>{
        if (a.completed === b.completed){return b.id - a.id }
        return a.completed ? 1 : -1;
    })
  return (
    <> 
    <div className="space-y-2">
      {todoSorted.map((todo) => (
        <TodoItem
        onDelete={onDelete}
          key={todo.id}
          onompletedCanage={onompletedCanage}
          todo={todo}
        />
      ))}
    </div>
    {todos.length === 0 && (  <p className="text-center text-red-300 text-sm">work your ass up and add your frist todos....</p> )}
    </>
  );
};

export default TodoList;
