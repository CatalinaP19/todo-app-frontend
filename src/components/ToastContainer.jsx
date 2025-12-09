import React, { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6" />;
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-6 h-6" />;
      default:
        return <InformationCircleIcon className="w-6 h-6" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-[#F0D9B5] to-[#E8C79E]',
          text: 'text-[#312C51]',
          icon: 'text-[#312C51]',
          border: 'border-[#F0D9B5]',
          shadow: 'shadow-[#F0D9B5]/50'
        };
      case 'error':
        return {
          bg: 'from-[#F1AAA9] to-[#E08B8A]',
          text: 'text-white',
          icon: 'text-white',
          border: 'border-[#F1AAA9]',
          shadow: 'shadow-[#F1AAA9]/50'
        };
      case 'warning':
        return {
          bg: 'from-yellow-400 to-yellow-300',
          text: 'text-yellow-900',
          icon: 'text-yellow-900',
          border: 'border-yellow-400',
          shadow: 'shadow-yellow-400/50'
        };
      default:
        return {
          bg: 'from-blue-400 to-blue-300',
          text: 'text-white',
          icon: 'text-white',
          border: 'border-blue-400',
          shadow: 'shadow-blue-400/50'
        };
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .toast-enter {
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .toast-exit {
          animation: slideOutRight 0.3s ease-in forwards;
        }

        .toast-progress {
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .progress-bar {
          animation: progressShrink 3s linear forwards;
        }

        @keyframes progressShrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>

      {toasts.map((toast) => {
        const styles = getStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`toast-enter pointer-events-auto max-w-md`}
          >
            <div className={`bg-gradient-to-r ${styles.bg} ${styles.text} rounded-2xl shadow-lg ${styles.shadow} border-2 ${styles.border} p-4 flex items-start gap-3 overflow-hidden backdrop-blur-sm`}
              style={{
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px ${styles.shadow}`
              }}>
              
              {/* Icon */}
              <div className={`flex-shrink-0 mt-1 ${styles.icon}`}>
                {getIcon(toast.type)}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm break-words">
                  {toast.message}
                </p>
              </div>

              {/* Botón cerrar */}
              <button
                onClick={() => removeToast(toast.id)}
                className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Barra de progreso */}
              <div className="absolute bottom-0 left-0 h-1 bg-current opacity-50">
                <div className="progress-bar h-full bg-current"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}