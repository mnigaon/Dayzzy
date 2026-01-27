import { useState } from "react";
import KanbanCard from "./KanbanCard";
import "./KanbanColumn.css";

export default function KanbanColumn({
  title,
  status,
  tasks,
  onSelectTask,
  onDropTask,
  isSystem = false,
  onDeleteColumn,
}) {
  const [isOver, setIsOver] = useState(false);

  const allowDrop = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    onDropTask?.(taskId, status);
  };

  return (
    <div
      className={`kanban-column ${isOver ? "drop-over" : ""}`}
      onDragOver={allowDrop}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <h3>{title}</h3>

        {!isSystem && (
          <button
            onClick={() => onDeleteColumn?.(status)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        )}

        <span className="count">{tasks.length}</span>
      </div>

      <div className="kanban-column-body">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onClick={() => onSelectTask?.(task)}
          />
        ))}
      </div>
    </div>
  );
}

