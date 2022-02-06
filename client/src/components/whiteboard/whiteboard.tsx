import { useEffect, useRef } from "react";
import whiteboardStyles from './whiteboard.module.scss';

export const Whiteboard = () => {

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (canvasContainerRef.current && canvasRef.current) {
        canvasRef.current.width = canvasContainerRef.current.clientWidth;
        canvasRef.current.height = canvasContainerRef.current.clientHeight;
      }
    });
    observer.observe(canvasContainerRef.current);
  }, []);

  return (
    <div
      ref={canvasContainerRef}
      className={whiteboardStyles.whiteboard}>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}