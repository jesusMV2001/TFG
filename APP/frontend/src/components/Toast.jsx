/**
 * Componente para mostrar mensajes de notificación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.type - Tipo de mensaje (success, error)
 * @param {Function} props.onClose - Función para cerrar el toast
 * @returns {JSX.Element|null}
 */
function Toast({ message, type = 'success', onClose }) {
    if (!message) return null;

    // Colores más intensos para mejor contraste
    const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
    const textColor = type === 'success' ? 'text-green-900' : 'text-red-900';
    const borderColor = type === 'success' ? 'border-green-300' : 'border-red-300';
    const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className={`${bgColor} ${textColor} px-12 py-6 rounded-lg shadow-lg border-2 ${borderColor} flex items-center gap-3 min-w-[300px]`}>
                <div className={iconColor}>
                    {type === 'success' ? (
                        <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <p className="text-lg font-medium flex-grow">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-4 text-2xl font-semibold hover:opacity-75 transition-opacity"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default Toast;