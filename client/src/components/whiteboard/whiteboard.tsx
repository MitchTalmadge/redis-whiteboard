import { MouseEvent, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/socket";
import whiteboardStyles from './whiteboard.module.scss';

export const Whiteboard = () => {
  const socket = useSocket();

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [lastMouseReportTime, setLastMouseReportTime] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (canvasContainerRef.current && canvasRef.current) {
        canvasRef.current.width = canvasContainerRef.current.clientWidth;
        canvasRef.current.height = canvasContainerRef.current.clientHeight;
      }
    });
    observer.observe(canvasContainerRef.current);
  }, []);

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const time = Date.now();
    if (time - lastMouseReportTime >= 100) {
      setLastMouseReportTime(time);
      socket?.emit("mousemove", {
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      className={whiteboardStyles.whiteboard}>
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}></canvas>
    </div >
  )
}