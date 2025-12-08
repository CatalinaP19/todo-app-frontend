import React from 'react';
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function TodoItem({ tarea, toggleCompleted, deleteTarea, editTarea }) {
  
  const handleEdit = () => {
    const nuevoTexto = prompt("Editar tarea:", tarea.text);
    if (nuevoTexto && nuevoTexto.trim()) {
      editTarea(tarea._id, nuevoTexto);
    }
  };

  return (
    <div className="flex items-center gap-3 justify-between border-b border-gray-300 py-3 px-4 hover:bg-gray-50 transition">
      <span className={tarea.completed ? 'line-through text-gray-500': 'text-gray-800'}>
        {tarea.text}
      </span>
      
      <div className="flex items-center gap-3">
        <input 
          className="w-4 h-4 cursor-pointer" 
          type="checkbox" 
          checked={tarea.completed} 
          onChange={() => toggleCompleted(tarea._id)}
        />
        <PencilIcon 
          onClick={handleEdit}
          className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700 transition" 
          title="Editar tarea"
        />
        <TrashIcon 
          onClick={() => deleteTarea(tarea._id)}
          className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition" 
          title="Eliminar tarea"
        />
      </div>
    </div>
  );
}