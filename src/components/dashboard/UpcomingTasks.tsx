import React from "react";
import { Card, Stack } from "react-bootstrap";
import { FiClipboard } from "react-icons/fi";

export interface UpcomingTaskItem {
  title: string;
  project: string;
  due: string;
  dueColor: string;
  iconBg: string;
  iconColor: string;
}

interface UpcomingTasksProps {
  tasks: UpcomingTaskItem[];
}

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks }) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Body className="p-4">
        <h6 className="fw-bold text-dark mb-4">Upcoming Tasks</h6>

        <Stack gap={3}>
          {tasks.map((t, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: t.iconBg,
                    color: t.iconColor,
                  }}
                >
                  <FiClipboard size={16} />
                </div>
                <div>
                  <span
                    className="fw-bold text-dark d-block"
                    style={{ fontSize: "13px" }}
                  >
                    {t.title}
                  </span>
                  <span className="text-muted" style={{ fontSize: "11.5px" }}>
                    {t.project}
                  </span>
                </div>
              </div>
              <span
                className="fw-semibold"
                style={{ color: t.dueColor, fontSize: "12px" }}
              >
                {t.due}
              </span>
            </div>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default UpcomingTasks;