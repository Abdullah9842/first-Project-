import { Todo } from "../types/todo";


interface todosSummaryProps{
    todos:Todo[];
    deleteAllCompleted:()=>void;
}

const TodoSummary = ({todos,deleteAllCompleted}:todosSummaryProps) => {
    const completedTodos = todos.filter(todo => todo.completed)
  return (
    <div className="text-center space-y-2">

        <p className="text-sm font-medium ">{completedTodos.length}/{todos.length} todos completed</p>
        
        {completedTodos.length > 0 && (<button onClick={deleteAllCompleted} className="text-red-500 hover:underline text-sm font-medium">Delete All Completed</button>)}
            </div>
    
  )
}

export default TodoSummary