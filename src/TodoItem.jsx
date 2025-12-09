import React, { useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function TodoItem({ tarea, toggleCompleted, deleteTarea, editTarea }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tarea.text);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleEdit = () => {
    if (editText.trim() && editText !== tarea.text) {
      editTarea(tarea._id, editText);
      setIsEditing(false);
    } else {
      setEditText(tarea.text);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(tarea.text);
    setIsEditing(false);
  };

  const handleToggleCompleted = () => {
    if (!tarea.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    toggleCompleted(tarea._id);
  };

  // Confetti component
  const ConfettiPiece = ({ delay, duration, left, color }) => (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${left}%`,
        top: '-10px',
        animation: `confettiFall ${duration}s linear ${delay}s forwards`,
        zIndex: 50
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }

        @keyframes confettiFloat {
          0%, 100% {
            transform: translateX(0) rotateZ(0deg);
          }
          25% {
            transform: translateX(30px) rotateZ(90deg);
          }
          50% {
            transform: translateX(0) rotateZ(180deg);
          }
          75% {
            transform: translateX(-30px) rotateZ(270deg);
          }
        }

        .confetti-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          pointer-events: none;
        }
      `}</style>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="confetti-wrapper">
          {[...Array(50)].map((_, i) => (
            <ConfettiPiece
              key={i}
              delay={Math.random() * 0.3}
              duration={2 + Math.random() * 0.5}
              left={Math.random() * 100}
              color={['#F0D9B5', '#F1AAA9', '#312C51', '#4B426D', '#E8C79E'][Math.floor(Math.random() * 5)]}
            />
          ))}
        </div>
      )}

      <div className={`flex items-center justify-between px-6 py-4 transition duration-300 ${
        tarea.completed ? 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] bg-opacity-30' : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50'
      }`}>
        {/* Checkbox y texto */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <input 
              type="checkbox" 
              checked={tarea.completed} 
              onChange={handleToggleCompleted}
              className="w-6 h-6 cursor-pointer accent-[#F0D9B5] rounded"
            />
            {tarea.completed && (
              <CheckIcon className="w-5 h-5 text-[#312C51] absolute top-0.5 left-0.5" />
            )}
          </div>

          {isEditing ? (
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-[#F0D9B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0D9B5] text-[#312C51]"
                autoFocus
              />
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] text-[#312C51] font-semibold rounded-lg hover:shadow-md transition"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <span className={`text-lg transition duration-200 ${
              tarea.completed 
                ? 'line-through text-[#4B426D] opacity-60' 
                : 'text-[#312C51] font-medium'
            }`}>
              {tarea.text}
            </span>
          )}
        </div>

        {/* Botones de acción */}
        {!isEditing && (
          <div className="flex items-center gap-4 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-[#4B426D] hover:bg-gradient-to-r hover:from-[#F0D9B5] hover:to-[#E8C79E] rounded-lg transition duration-200 transform hover:scale-110"
              title="Editar tarea"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteTarea(tarea._id)}
              className="p-2 text-[#F1AAA9] hover:bg-gradient-to-r hover:from-[#F1AAA9] hover:to-[#E08B8A] rounded-lg transition duration-200 transform hover:scale-110"
              title="Eliminar tarea"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}