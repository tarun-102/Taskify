import React from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";

interface TaskOverviewProps {
  tasks?: any[];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks = [] }) => {
  const radius = 15.9155;
  const strokeWidth = 5.5;

  const total = tasks.length;

  const completed = tasks.filter((t) =>
    ["completed", "done"].includes(t.status?.toLowerCase()),
  ).length;

  const inProgress = tasks.filter((t) =>
    ["in-progress", "active"].includes(t.status?.toLowerCase()),
  ).length;

  const todo = total - completed - inProgress;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const todoPct = total > 0 ? 100 - completedPct - inProgressPct : 0;

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold text-dark mb-0">Task Overview</h6>
          <Badge
            bg="light"
            text="secondary"
            className="border fw-medium px-2 py-1"
            style={{ fontSize: "11px" }}
          >
            All Tasks
          </Badge>
        </div>

        <Row className="align-items-center justify-content-center flex-nowrap flex-grow-1 m-0">
          <Col xs="auto" className="pe-2 pe-sm-4">
            <div
              className="position-relative d-flex justify-content-center align-items-center"
              style={{ width: "135px", height: "135px" }}
            >
              <svg
                viewBox="0 0 42 42"
                className="w-100 h-100"
                style={{
                  transform: "rotate(-90deg)",
                  filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.06))",
                }}
              >
                <circle
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="none"
                  stroke="#F8FAFC"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${completedPct} ${100 - completedPct}`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${inProgressPct} ${100 - inProgressPct}`}
                  strokeDashoffset={`-${completedPct}`}
                />
                <circle
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${todoPct} ${100 - todoPct}`}
                  strokeDashoffset={`-${completedPct + inProgressPct}`}
                />
              </svg>

              <div className="position-absolute d-flex flex-column align-items-center justify-content-center text-center mt-1">
                <h3 className="fw-bold text-dark mb-0 lh-1">{total}</h3>
                <span
                  className="text-muted fw-medium mt-1"
                  style={{ fontSize: "10px" }}
                >
                  Total Tasks
                </span>
              </div>
            </div>
          </Col>

          <Col xs="auto" className=" ms-5 ps-2 ps-sm-0">
            <div className="d-inline-flex flex-column gap-3 text-start">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#10B981",
                  }}
                ></div>
                <div className="d-flex flex-column">
                  <span
                    className="text-secondary mb-0"
                    style={{ fontSize: "12px", lineHeight: "1.2" }}
                  >
                    Completed
                  </span>
                  <span
                    className="fw-bold text-dark"
                    style={{ fontSize: "14px", lineHeight: "1.2" }}
                  >
                    {completed} ({completedPct}%)
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#3B82F6",
                  }}
                ></div>
                <div className="d-flex flex-column">
                  <span
                    className="text-secondary mb-0"
                    style={{ fontSize: "12px", lineHeight: "1.2" }}
                  >
                    In Progress
                  </span>
                  <span
                    className="fw-bold text-dark"
                    style={{ fontSize: "14px", lineHeight: "1.2" }}
                  >
                    {inProgress} ({inProgressPct}%)
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#94A3B8",
                  }}
                ></div>
                <div className="d-flex flex-column">
                  <span
                    className="text-secondary mb-0"
                    style={{ fontSize: "12px", lineHeight: "1.2" }}
                  >
                    To Do
                  </span>
                  <span
                    className="fw-bold text-dark"
                    style={{ fontSize: "14px", lineHeight: "1.2" }}
                  >
                    {todo} ({todoPct}%)
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TaskOverview;