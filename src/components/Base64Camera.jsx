import React, { useRef, useState } from 'react';

export default function Base64Camera({ onCapture, children, capture = false, inputId="cameraInput" }) {
    const inputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClick = () => {
        if (inputRef.current) inputRef.current.click();
    };

    const processFile = (file) => {
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            if (onCapture) {
                onCapture(base64String);
            }
            setIsProcessing(false);
        };

        reader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
            setIsProcessing(false);
        };

        // Convierte el archivo a Data URL (Base64)
        reader.readAsDataURL(file);
    };

    const handleFileChange = (event) => {
        if (event.target.files) {
            const file = event.target.files[0];
            processFile(file);
            event.target.value = '';
        }
    };

    return (
        <div onClick={handleClick} className="cursor-pointer inline-block relative">
            {capture ? <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"  capture="environment" id={inputId} /> : <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={inputId} />}

            <div className={isProcessing ? "opacity-50 pointer-events-none" : ""}>
                {children}
            </div>
        </div>
    );
};