import { Trash2 } from "lucide-react";
import { Todo } from "../types/todo";

interface Props {
  todo: Todo;
  onompletedCanage:(id:number, completed:boolean)=> void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo,onompletedCanage,onDelete }: Props) {
  return (
    <div className="flex items-center gap-1"> 
      <label className=" grow flex items-center gap-2 border rounded-md p-2 border-gray-400 bg-white hover:bg-slate-50">
        <input 
        checked={todo.completed} onChange={(e) => onompletedCanage(todo.id, e.target.checked)}
         type="checkbox" className="scale-125" />
      
      <span className={todo.completed ? "line-through text-gray-400" : "" }>{todo.title}</span>
      </label>
      
      <button className="p-2" onClick={()=> onDelete(todo.id)}> <Trash2 size={20 } className="text-gray-400" /></button>
    </div>
  );
}
