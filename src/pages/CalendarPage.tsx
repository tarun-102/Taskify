import React, { useState, useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/task/taskSlice";

const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
    if (tasks.length === 0) dispatch(fetchTasks());
  }, [dispatch, projects.length, tasks.length]);

  const getSafeDateStr = (dateVal: any) => {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const events: any[] = [];

  tasks.forEach((t: any) => {
    const dStr = getSafeDateStr(t.dueDate);
    if (dStr) {
      events.push({
        id: `task-${t._id || t.id}`,
        title: t.taskName,
        date: dStr,
        type: "Task",
        bg: "#EFF6FF",
        color: "#3B82F6",
        border: "#BFDBFE",
      });
    }
  });

  projects.forEach((p: any) => {
    const dStr = getSafeDateStr(p.dueDate || p.endDate);
    if (dStr) {
      events.push({
        id: `proj-${p._id || p.id}`,
        title: p.projectName,
        date: dStr,
        type: "Project",
        bg: "#F0FDF4",
        color: "#10B981",
        border: "#BBF7D0",
      });
    }
  });

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="pe-lg-2">
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Calendar & Schedule</h4>
          <p className="text-secondary small mb-0">Track your upcoming project and task deadlines.</p>
        </div>
        <div className="d-flex gap-2 align-items-center bg-white px-3 py-2 rounded-3 shadow-sm border">
          <Badge bg="transparent" className="text-dark p-0 d-flex align-items-center gap-1">
            <span style={{ color: "#10B981", fontSize: "14px" }}>●</span> <span className="fw-medium">Projects</span>
          </Badge>
          <div className="vr mx-1" style={{ opacity: 0.15 }}></div>
          <Badge bg="transparent" className="text-dark p-0 d-flex align-items-center gap-1">
            <span style={{ color: "#3B82F6", fontSize: "14px" }}>●</span> <span className="fw-medium">Tasks</span>
          </Badge>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="bg-white border-bottom p-3 p-md-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
            <FiCalendar className="text-primary d-none d-md-block" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h5>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              className="border rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={prevMonth}
            >
              <FiChevronLeft size={18} />
            </Button>
            <Button
              variant="light"
              className="border rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={nextMonth}
            >
              <FiChevronRight size={18} />
            </Button>
          </div>
        </div>

        <Card.Body className="p-2 p-md-4 bg-light bg-md-white">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "4px" }}>
            {weekDays.map((day, idx) => (
              <div key={idx} className="text-center fw-bold text-secondary text-uppercase text-truncate" style={{ fontSize: "11px", letterSpacing: "0.5px", paddingBottom: "4px" }}>
                {day.substring(0, 3)}
              </div>
            ))}

            {daysArray.map((dayObj, idx) => {
              let dayEvents: any[] = [];
              if (dayObj) {
                const dStr = getSafeDateStr(dayObj);
                dayEvents = events.filter((e) => e.date === dStr);
              }

              const isToday = dayObj && getSafeDateStr(dayObj) === getSafeDateStr(new Date());
              const visibleEvents = dayEvents.slice(0, 2);
              const extraCount = dayEvents.length - 2;

              return (
                <div
                  key={idx}
                  className="border rounded-2 rounded-md-4 p-1 p-md-2 d-flex flex-column bg-white overflow-hidden"
                  style={{
                    minHeight: "85px",
                    borderColor: isToday ? "#5850EC" : "#E2E8F0",
                    borderWidth: isToday ? "2px" : "1px",
                    opacity: dayObj ? 1 : 0.4,
                    boxShadow: isToday ? "0 4px 12px rgba(88, 80, 236, 0.15)" : "none",
                  }}
                >
                  {dayObj && (
                    <>
                      <div className="d-flex justify-content-center mb-1 mb-md-2">
                        <div
                          className={`fw-bold d-flex align-items-center justify-content-center rounded-circle ${
                            isToday ? "bg-primary text-white shadow-sm" : "text-dark"
                          }`}
                          style={{ width: "22px", height: "22px", fontSize: "12px" }}
                        >
                          {dayObj.getDate()}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1 overflow-hidden w-100">
                        {visibleEvents.map((evt, i) => (
                          <div
                            key={i}
                            className="px-1 py-1 rounded-2 text-truncate text-center text-md-start"
                            style={{
                              backgroundColor: evt.bg,
                              color: evt.color,
                              border: `1px solid ${evt.border}`,
                              fontSize: "9px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                            title={evt.title}
                          >
                            {evt.title}
                          </div>
                        ))}
                        {extraCount > 0 && (
                          <div
                            className="px-1 py-1 rounded-2 text-center fw-bold text-secondary text-truncate"
                            style={{
                              backgroundColor: "#F1F5F9",
                              fontSize: "9px",
                            }}
                          >
                            +{extraCount}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CalendarPage;