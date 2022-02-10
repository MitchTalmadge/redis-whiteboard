import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../../context/socket";
import whiteboardStyles from './whiteboard.module.scss';
import { PaperScope, Path, Point, Size } from "paper/dist/paper-core";
import { useAsRef } from "../../hooks/ref";

export const Whiteboard = () => {
  const socketContext = useSocketContext();

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [paperScope] = useState(() => {
    return new PaperScope();
  });

  const [lastMouseReportTime, setLastMouseReportTime] = useState(0);
  const lastMouseReportTimeRef = useAsRef(lastMouseReportTime);

  /**
   * Sets up the paper.js canvas.
   */
  useEffect(() => {
    paperScope.setup(canvasRef.current);
    return () => {
      paperScope.project?.clear();
    };
  }, []);

  /**
   * Auto-resizes the canvas to match its container.
   */
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (canvasContainerRef.current && canvasRef.current) {
        canvasRef.current.width = canvasContainerRef.current.clientWidth;
        canvasRef.current.height = canvasContainerRef.current.clientHeight;
        if (paperScope) {
          paperScope.view.viewSize = new Size(canvasContainerRef.current.clientWidth, canvasContainerRef.current.clientHeight);
          paperScope.view.update();
        }
      }
    });
    observer.observe(canvasContainerRef.current);
  }, [paperScope]);

  /**
   * Sets up mouse movement listeners.
   */
  useEffect(() => {
    paperScope.view.onMouseDown = (event: paper.MouseEvent) => {
      socketContext.sendMessage({
        event: 'path-start',
        data: {
          x: event.point.x,
          y: event.point.y,
          closed: false,
          strokeCap: 'round',
          strokeColor: 'blue',
          strokeWidth: 10
        }
      });
    };

    paperScope.view.onMouseDrag = (event: paper.MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseReportTimeRef.current > 30) {
        socketContext.sendMessage({
          event: 'path-append',
          data: {
            x: event.point.x,
            y: event.point.y
          }
        });
        setLastMouseReportTime(now);
      }
    };

    paperScope.view.onMouseUp = (event: paper.MouseEvent) => {
      socketContext.sendMessage({
        event: 'path-end',
        data: {
          x: event.point.x,
          y: event.point.y
        }
      });
    };

    return () => {
      paperScope.view.onMouseDown = null;
      paperScope.view.onMouseDrag = null;
      paperScope.view.onMouseUp = null;
    }
  }, [paperScope, socketContext.sendMessage]);

  useEffect(() => {
    if (!paperScope) {
      return;
    }
    socketContext.onMessage(message => {
      switch (message.event) {
        case 'path-start': {
          new Path({
            segments: [
              new Point(message.data.x, message.data.y)
            ],
            closed: message.data.closed,
            strokeCap: message.data.strokeCap,
            strokeColor: message.data.strokeColor,
            strokeWidth: message.data.strokeWidth,
            data: {
              id: message.data.itemId
            }
          });
          break;
        }
        case 'path-append': {
          const path = paperScope.project.getItem({ data: { id: message.data.itemId } }) as paper.Path;
          if (!path) {
            console.error('Could not find path with id for append: ' + message.data.itemId);
            return;
          }
          path.add(new Point(message.data.x, message.data.y));
          path.smooth();
          break;
        }
        case 'path-end': {
          const path = paperScope.project.getItem({ data: { id: message.data.itemId } }) as paper.Path;
          if (!path) {
            console.error('Could not find path with id for end: ' + message.data.itemId);
            return;
          }
          path.add(new Point(message.data.x, message.data.y));
          path.smooth();
          break;
        }
      }
    });

  }, [paperScope, socketContext.onMessage]);

  return (
    <div
      ref={canvasContainerRef}
      className={whiteboardStyles.whiteboard}>
      <canvas ref={canvasRef}></canvas>
    </div >
  )
}