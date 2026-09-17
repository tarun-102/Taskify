import React, { useState, useEffect, useMemo } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiFolder,
  FiCheckSquare,
} from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/task/taskSlice";
import { useNavigate } from "react-router-dom";

const CalendarPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const events = useMemo(() => {
    const list: any[] = [];

    tasks.forEach((t: any) => {
      const dStr = getSafeDateStr(t.dueDate);
      if (dStr) {
        list.push({
          id: `task-${t._id || t.id}`,
          title: t.taskName,
          date: dStr,
          rawDate: new Date(t.dueDate),
          type: "Task",
          status: t.status,
          priority: t.priority,
          bg: "#EFF6FF",
          color: "#3B82F6",
          border: "#BFDBFE",
          dotColor: "#3B82F6",
          link: `/tasks/${t._id || t.id}`,
        });
      }
    });

    projects.forEach((p: any) => {
      const dStr = getSafeDateStr(p.dueDate || p.endDate);
      if (dStr) {
        list.push({
          id: `proj-${p._id || p.id}`,
          title: p.projectName,
          date: dStr,
          rawDate: new Date(p.dueDate || p.endDate),
          type: "Project",
          status: p.status,
          priority: p.priority,
          bg: "#F0FDF4",
          color: "#10B981",
          border: "#BBF7D0",
          dotColor: "#10B981",
          link: `/projects/${p._id || p.id}`,
        });
      }
    });

    return list;
  }, [tasks, projects]);

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
    );
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedDateStr = getSafeDateStr(selectedDate);
  const selectedDayEvents = events.filter((e) => e.date === selectedDateStr);

  return (
    <div className="pe-lg-2">
      {/* Header */}
      <div className="mb-3 mb-md-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 gap-sm-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Calendar & Schedule</h4>
          <p className="text-secondary small mb-0">
            Track your upcoming project and task deadlines.
          </p>
        </div>

        {/* Legend */}
        <div className="d-flex gap-2 align-items-center bg-white px-3 py-2 rounded-3 shadow-sm border align-self-start align-self-sm-auto">
          <Badge
            bg="transparent"
            className="text-dark p-0 d-flex align-items-center gap-1 small"
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
              }}
            />
            <span className="fw-medium text-secondary" style={{ fontSize: "12px" }}>
              Projects
            </span>
          </Badge>
          <div className="vr mx-1" style={{ opacity: 0.15 }} />
          <Badge
            bg="transparent"
            className="text-dark p-0 d-flex align-items-center gap-1 small"
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#3B82F6",
              }}
            />
            <span className="fw-medium text-secondary" style={{ fontSize: "12px" }}>
              Tasks
            </span>
          </Badge>
        </div>
      </div>

      {/* Main Calendar Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="bg-white border-bottom p-3 p-md-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <FiCalendar className="text-primary fs-5 d-none d-sm-block" />
            <h5 className="fw-bold text-dark mb-0 fs-6 fs-sm-5">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h5>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="light"
              size="sm"
              className="border px-2 py-1 small fw-semibold text-secondary rounded-2"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="light"
              size="sm"
              className="border rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={prevMonth}
              aria-label="Previous Month"
            >
              <FiChevronLeft size={18} />
            </Button>
            <Button
              variant="light"
              size="sm"
              className="border rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={nextMonth}
              aria-label="Next Month"
            >
              <FiChevronRight size={18} />
            </Button>
          </div>
        </div>

        <Card.Body className="p-2 p-md-3 bg-white">
          {/* Weekday Headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: "2px",
              marginBottom: "6px",
            }}
          >
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className="text-center fw-bold text-muted text-uppercase"
                style={{ fontSize: "11px", letterSpacing: "0.5px", padding: "4px 0" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: "3px",
            }}
          >
            {daysArray.map((dayObj, idx) => {
              let dayEvents: any[] = [];
              if (dayObj) {
                const dStr = getSafeDateStr(dayObj);
                dayEvents = events.filter((e) => e.date === dStr);
              }

              const isToday =
                dayObj &&
                getSafeDateStr(dayObj) === getSafeDateStr(new Date());
              const isSelected =
                dayObj &&
                getSafeDateStr(dayObj) === selectedDateStr;

              const visibleEvents = dayEvents.slice(0, 2);
              const extraCount = dayEvents.length - 2;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (dayObj) setSelectedDate(dayObj);
                  }}
                  className={`border rounded-3 p-1 d-flex flex-column transition-all ${
                    dayObj ? "cursor-pointer" : ""
                  }`}
                  style={{
                    minHeight: "52px",
                    height: "auto",
                    borderColor: isSelected
                      ? "#5850EC"
                      : isToday
                        ? "#93C5FD"
                        : "#F1F5F9",
                    borderWidth: isSelected ? "2px" : "1px",
                    backgroundColor: isSelected
                      ? "#F5F3FF"
                      : isToday
                        ? "#F8FAFC"
                        : dayObj
                          ? "#FFFFFF"
                          : "#FAFAFA",
                    opacity: dayObj ? 1 : 0.3,
                    cursor: dayObj ? "pointer" : "default",
                  }}
                >
                  {dayObj && (
                    <>
                      {/* Day Number Header */}
                      <div className="d-flex justify-content-center justify-content-md-between align-items-center mb-1">
                        <div
                          className={`fw-bold d-flex align-items-center justify-content-center rounded-circle ${
                            isToday
                              ? "bg-primary text-white shadow-sm"
                              : isSelected
                                ? "bg-dark text-white"
                                : "text-dark"
                          }`}
                          style={{
                            width: "22px",
                            height: "22px",
                            fontSize: "11px",
                          }}
                        >
                          {dayObj.getDate()}
                        </div>

                        {/* Event count badge on desktop */}
                        {dayEvents.length > 0 && (
                          <span
                            className="d-none d-md-inline-block badge rounded-pill bg-light text-secondary border"
                            style={{ fontSize: "10px", padding: "2px 5px" }}
                          >
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Desktop Event Pills (>=768px) */}
                      <div className="d-none d-md-flex flex-column gap-1 overflow-hidden w-100">
                        {visibleEvents.map((evt, i) => (
                          <div
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(evt.link);
                            }}
                            className="px-1 py-0.5 rounded text-truncate"
                            style={{
                              backgroundColor: evt.bg,
                              color: evt.color,
                              border: `1px solid ${evt.border}`,
                              fontSize: "10px",
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
                            className="px-1 py-0.5 rounded text-center fw-bold text-secondary text-truncate"
                            style={{
                              backgroundColor: "#F1F5F9",
                              fontSize: "9px",
                            }}
                          >
                            +{extraCount} more
                          </div>
                        )}
                      </div>

                      {/* Mobile Indicator Dots (<768px) */}
                      <div className="d-flex d-md-none justify-content-center align-items-center gap-1 mt-auto pb-1">
                        {dayEvents.slice(0, 3).map((evt, i) => (
                          <span
                            key={i}
                            style={{
                              display: "inline-block",
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              backgroundColor: evt.dotColor,
                            }}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span
                            style={{
                              fontSize: "8px",
                              fontWeight: "bold",
                              color: "#64748B",
                            }}
                          >
                            +
                          </span>
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

      {/* Selected Day Agenda / Event Details Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="bg-white border-bottom p-3 p-md-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <FiClock className="text-secondary" />
            <h6 className="fw-bold text-dark mb-0">
              Schedule for{" "}
              {selectedDate.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h6>
          </div>
          <Badge bg="light" text="dark" className="border fw-semibold">
            {selectedDayEvents.length}{" "}
            {selectedDayEvents.length === 1 ? "Event" : "Events"}
          </Badge>
        </div>

        <Card.Body className="p-3 p-md-4">
          {selectedDayEvents.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {selectedDayEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => navigate(evt.link)}
                  className="d-flex align-items-center justify-content-between p-3 rounded-3 border transition-all"
                  style={{
                    backgroundColor: evt.bg,
                    borderColor: evt.border,
                    cursor: "pointer",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: evt.color,
                      }}
                    >
                      {evt.type === "Project" ? (
                        <FiFolder size={18} />
                      ) : (
                        <FiCheckSquare size={18} />
                      )}
                    </div>
                    <div>
                      <span className="fw-bold text-dark d-block small mb-1">
                        {evt.title}
                      </span>
                      <div className="d-flex gap-2 align-items-center">
                        <span
                          className="badge text-capitalize"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.06)",
                            color: evt.color,
                            fontSize: "10px",
                          }}
                        >
                          {evt.type}
                        </span>
                        {evt.priority && (
                          <span
                            className="badge text-capitalize"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.06)",
                              color: "#475569",
                              fontSize: "10px",
                            }}
                          >
                            {evt.priority} Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    size="sm"
                    className="border-0 bg-white shadow-sm small fw-semibold text-secondary"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <FiClock size={28} className="mb-2 opacity-50" />
              <p className="small mb-0">
                No tasks or projects scheduled on this day.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CalendarPage;