import { useEffect, useState } from "react";
import { Todo } from "../types/todo";
import { dummyData } from "../data/todos";


export default function useTodos() {
    const [todos, setTodos] = useState(()=>{
        const savedTodos:Todo[] = JSON.parse(localStorage.getItem("todos") ||" []")
        return savedTodos.length > 0 ? savedTodos : dummyData
      });
    
      useEffect(()=> {
        localStorage.setItem("todos", JSON.stringify(todos));
      }, [todos])
    
    
      function setTodoCompleted(id: number, completed: boolean) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
        );
      }
      function addtodo(title: string) {
        setTodos((prevTodos) => [
          {
            id: Date.now(),
            title,
            completed: false,
          },
          ...prevTodos,
        ]);
      }
    function deletetodo(id:number){
      setTodos(prevTodos => prevTodos.filter(todo=> todo.id !== id))
    
    }
    function deleteAllCompletedtodos(){
      setTodos(prevtodos => prevtodos.filter(todo => !todo.completed))
    }
  return { 
    todos,setTodoCompleted,deleteAllCompletedtodos,addtodo,deletetodo,
  }
}

