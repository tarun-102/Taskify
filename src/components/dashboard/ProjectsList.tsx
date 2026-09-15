import React from "react";
import { Card, ProgressBar, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
export interface ProjectItem {
  name: string;
  tasks: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

interface ProjectsListProps {
  projects: ProjectItem[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const navigate = useNavigate(); 

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-dark mb-0">My Projects</h6>
          
          
          <span
            onClick={() => navigate("/projects")}
            className="fw-semibold"
            style={{ color: "#4F46E5", fontSize: "13px", cursor: "pointer" }}
          >
            View all
          </span>
        </div>

        <Stack gap={3}>
          {projects.map((p, idx) => (
            <div key={idx}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: p.bg,
                      color: p.color,
                    }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <span className="fw-bold text-dark small d-block">
                      {p.name}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>
                      {p.tasks}
                    </span>
                  </div>
                </div>
                <span className="text-muted small fw-bold">{p.progress}%</span>
              </div>
              <div className="mt-2 ps-5">
                <ProgressBar
                  now={p.progress}
                  style={{ height: "4px", backgroundColor: "#F1F5F9" }}
                  variant={p.progress === 100 ? "success" : "primary"}
                />
              </div>
            </div>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default ProjectsList;