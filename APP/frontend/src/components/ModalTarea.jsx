import { useEffect } from "react";

function ModalTarea({ children, isOpen, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-[4px]">
            <div className="bg-white p-8 rounded-xl w-[90%] max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl relative animate-[fadeIn_0.3s_ease-in-out]">
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition-all duration-200 hover:rotate-90"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default ModalTarea;