import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

interface MyBoard {
    brushColor: string;
    brushSize: number;
    brushShape: 'round' | 'square';
}

const CanvasContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledCanvas = styled.canvas`
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 5px;
`;

const Board: React.FC<MyBoard> = ({ brushColor, brushSize, brushShape }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setSocket] = useState<any>(null);
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        console.log(newSocket, "Connected to socket");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('canvasImage', (data: string) => {
                const image = new Image();
                image.src = data;

                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (ctx) {
                    image.onload = () => {
                        ctx.drawImage(image, 0, 0);
                    };
                }
            });

            return () => {
                socket.off('canvasImage');
            };
        }
    }, [socket]);

    useEffect(() => {
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const startDrawing = (e: MouseEvent) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        };

        const draw = (e: MouseEvent) => {
            if (!isDrawing) return;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;
                ctx.lineCap = brushShape;
                ctx.lineJoin = brushShape;

                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }
        };

        const endDrawing = () => {
            isDrawing = false;
            const canvas = canvasRef.current;
            if (canvas) {
                const dataURL = canvas.toDataURL();
                if (socket) {
                    socket.emit('canvasImage', dataURL);
                }
            }
        };

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', endDrawing);
            canvas.addEventListener('mouseout', endDrawing);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', endDrawing);
                canvas.removeEventListener('mouseout', endDrawing);
            }
        };
    }, [brushColor, brushSize, brushShape, socket]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return (
        <CanvasContainer>
            <StyledCanvas
                ref={canvasRef}
                width={windowSize[0] > 600 ? 600 : 300}
                height={windowSize[1] > 400 ? 400 : 200}
            />
        </CanvasContainer>
    );
};

export default Board;
