import React from "react";
import { Card, Stack } from "react-bootstrap";

export interface ActivityItem {
  user: string;
  action: string;
  time: string;
  avatar: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const avatarColors = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"];

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Body className="p-4">
        <h6 className="fw-bold text-dark mb-4">Recent Activity</h6>

        <Stack gap={3}>
          {activities.map((a, idx) => (
            <div key={idx} className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: avatarColors[idx % avatarColors.length],
                  fontSize: "14px",
                }}
              >
                {getInitials(a.user)}
              </div>
              <div style={{ lineHeight: "1.3" }}>
                <span className="text-dark" style={{ fontSize: "13px" }}>
                  <strong className="fw-bold">{a.user}</strong> {a.action}
                </span>
                <span
                  className="text-muted d-block mt-1"
                  style={{ fontSize: "11px" }}
                >
                  {a.time}
                </span>
              </div>
            </div>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default RecentActivity;