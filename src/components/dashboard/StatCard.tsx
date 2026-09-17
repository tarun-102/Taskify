import React from "react";
import { Card, Col, ProgressBar } from "react-bootstrap";

export interface StatItem {
  title: string;
  count: string;
  changeText?: string;
  progressValue?: number;
  progressVariant?: string;
}

interface StatCardProps {
  stat: StatItem;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <Col xs={6} lg={3}>
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body className="d-flex flex-column justify-content-between p-2.5 p-sm-3">
          <div>
            <Card.Subtitle
              className="text-secondary small fw-medium mb-1 text-truncate"
              style={{ fontSize: "0.8rem" }}
            >
              {stat.title}
            </Card.Subtitle>
            <Card.Title
              className="fw-bold text-dark mb-0"
              style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.8rem)" }}
            >
              {stat.count}
            </Card.Title>
          </div>

          {stat.changeText ? (
            <Card.Text
              className="text-success fw-medium mt-2 mb-0 text-truncate"
              style={{ fontSize: "11px" }}
            >
              {stat.changeText}
            </Card.Text>
          ) : (
            <div className="d-flex justify-content-between align-items-center mt-2 gap-1">
              <ProgressBar
                now={stat.progressValue}
                variant={stat.progressVariant}
                style={{ height: "4px", width: "45%", minWidth: "35px" }}
              />
              <span
                className="text-muted fw-semibold flex-shrink-0"
                style={{ fontSize: "11px" }}
              >
                {stat.progressValue}%
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default StatCard;
