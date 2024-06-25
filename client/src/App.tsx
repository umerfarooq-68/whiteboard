import { useEffect, useState } from 'react';
import './App.css';
import Board from './component/Board';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToolsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const ToolItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004494;
  }

  &:focus {
    outline: none;
  }
`;

const StyledSelect = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #007BFF;
  }

  &:focus {
    outline: none;
    border-color: #007BFF;
  }
`;

const CanvasDrawing = () => {
  const [brushColor, setBrushColor] = useState('black');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [brushShape, setBrushShape] = useState<'round' | 'square'>('round');

  useEffect(() => {
    console.log("CanvasDrawing ", brushSize);
  }, [brushSize]);

  const clearCanvas = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvasImage = () => {
    const canvas = document.querySelector('canvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-drawing.png';
    link.click();
  };

  return (
    <div className="App">
      <h1>Collaborative Whiteboard Developed by Umer</h1>
      <CanvasContainer>
        <Board brushColor={brushColor} brushSize={brushSize} brushShape={brushShape} />
        <ToolsContainer>
          <ToolItem>
            <span>Color: </span>
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
          </ToolItem>
          <ToolItem>
            <span>Size: </span>
            <input type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
            <span>{brushSize}</span>
          </ToolItem>
          <ToolItem>
            <span>Shape: </span>
            <StyledSelect value={brushShape} onChange={(e) => setBrushShape(e.target.value as 'round' | 'square')}>
              <option value="round">Round</option>
              <option value="square">Square</option>
            </StyledSelect>
          </ToolItem>
          <ToolItem>
            <StyledButton onClick={clearCanvas}>Clear Canvas</StyledButton>
          </ToolItem>
          <ToolItem>
            <StyledButton onClick={saveCanvasImage}>Save Image</StyledButton>
          </ToolItem>
        </ToolsContainer>
      </CanvasContainer>
    </div>
  );
};

export default CanvasDrawing;
