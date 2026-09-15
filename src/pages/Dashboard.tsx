import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { FiClipboard, FiCheckCircle, FiFigma, FiLayout, FiFolder, FiClock, FiActivity } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchTasks } from "../features/task/taskSlice";

import StatCard, { type StatItem } from "../components/dashboard/StatCard";
import ProjectsList, { type ProjectItem } from "../components/dashboard/ProjectsList";
import TaskOverview from "../components/dashboard/TaskOverview";
import UpcomingTasks, { type UpcomingTaskItem } from "../components/dashboard/UpcomingTasks";
import RecentActivity, { type ActivityItem } from "../components/dashboard/RecentActivity";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
    if (tasks.length === 0) dispatch(fetchTasks());
  }, [dispatch, projects.length, tasks.length]);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  
  const inProgressTasks = tasks.filter((t) => {
    const s = (t.status as string)?.toLowerCase();
    return s === "in-progress" || s === "active";
  }).length;
  
  const completedTasks = tasks.filter((t) => {
    const s = (t.status as string)?.toLowerCase();
    return s === "completed" || s === "done";
  }).length;

  const completedProjectsCount = projects.filter((p) => {
    const s = ((p as any).status as string)?.toLowerCase();
    return s === "completed" || s === "done";
  }).length;

  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const completedPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsData: StatItem[] = [
    { title: "Total Projects", count: totalProjects.toString(), changeText: `${completedProjectsCount} completed` },
    { title: "Total Tasks", count: totalTasks.toString(), changeText: "Across all projects" },
    {
      title: "Tasks In Progress",
      count: inProgressTasks.toString(),
      progressValue: inProgressPercent,
      progressVariant: "primary",
    },
    {
      title: "Tasks Completed",
      count: completedTasks.toString(),
      progressValue: completedPercent,
      progressVariant: "success",
    },
  ];

  const projectColors = [
    { color: "#10B981", bg: "#D1FAE5", icon: <FiLayout size={16} /> },
    { color: "#3B82F6", bg: "#DBEAFE", icon: <FiFigma size={16} /> },
    { color: "#EC4899", bg: "#FCE7F3", icon: <FiClipboard size={16} /> },
    { color: "#8B5CF6", bg: "#EDE9FE", icon: <FiCheckCircle size={16} /> },
  ];

  const projectsData: ProjectItem[] = projects.slice(0, 4).map((proj, index) => {
    const projId = proj._id || (proj as any).id;
    
    const projTasks = tasks.filter((t) => {
      const tpId = (t as any).project?._id || (t as any).project || (t as any).projectId;
      return tpId === projId;
    });

    const projCompleted = projTasks.filter((t) => {
      const s = (t.status as string)?.toLowerCase();
      return s === "completed" || s === "done";
    }).length;

    const projStatus = ((proj as any).status as string)?.toLowerCase();
    
    let progress = 0;
    if (projStatus === "completed" || projStatus === "done") {
      progress = 100;
    } else if (projTasks.length > 0) {
      progress = Math.round((projCompleted / projTasks.length) * 100);
    }
    
    const style = projectColors[index % projectColors.length];

    return {
      name: proj.projectName || "Untitled Project",
      tasks: `${projTasks.length} tasks`,
      progress: progress,
      icon: style.icon,
      color: style.color,
      bg: style.bg,
    };
  });

  const upcomingTasksData: UpcomingTaskItem[] = [...tasks]
    .filter((t) => {
      const s = (t.status as string)?.toLowerCase();
      return s !== "completed" && s !== "done"; 
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3) 
    .map((task) => {
      const tpId = (task as any).project?._id || (task as any).project || (task as any).projectId;
      const relProject = projects.find((p) => (p._id || (p as any).id) === tpId);
      
      const dateObj = new Date(task.dueDate);
      const today = new Date();
      let dueStr = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      
      if (dateObj.toDateString() === today.toDateString()) {
        dueStr = "Today";
      }

      return {
        title: task.taskName,
        project: relProject?.projectName || "No Project",
        due: dueStr,
        dueColor: dueStr === "Today" ? "#EF4444" : "#3B82F6",
        iconBg: dueStr === "Today" ? "#FFF1F2" : "#EFF6FF",
        iconColor: dueStr === "Today" ? "#EF4444" : "#3B82F6",
      };
    });

  const recentActivityData: ActivityItem[] = [...tasks]
    .slice(-4)
    .reverse()
    .map((task) => {
      const status = (task.status as string)?.toLowerCase();
      let actionStr = `added new task "${task.taskName}"`;
      
      if (status === "completed" || status === "done") {
        actionStr = `completed task "${task.taskName}"`;
      } else if (status === "in-progress" || status === "active") {
        actionStr = `is working on "${task.taskName}"`;
      }

      return {
        user: user?.name?.split(' ')[0] || "You",
        action: actionStr,
        time: "Recently",
        avatar: "", 
      };
    });

  return (
    <div className="pe-lg-2">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Good morning, {user?.name?.split(' ')[0] || 'User'}! </h4>
        <p className="text-secondary small mb-0">
          Here's what's happening with your projects today.
        </p>
      </div>

      <Row className="g-3 mb-4">
        {statsData.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={7}>
          {projectsData.length > 0 ? (
            <ProjectsList projects={projectsData} />
          ) : (
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center text-muted">
              <FiFolder size={40} className="mb-2 opacity-50" />
              <h6>No Projects Found</h6>
              <p className="small">Create a project to see it here.</p>
            </div>
          )}
        </Col>
        <Col xs={12} lg={5}>
          <TaskOverview tasks={tasks} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={6}>
          {upcomingTasksData.length > 0 ? (
            <UpcomingTasks tasks={upcomingTasksData} />
          ) : (
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center text-muted h-100 d-flex flex-column justify-content-center">
              <FiClock size={40} className="mb-2 opacity-50 mx-auto" />
              <h6>No Upcoming Tasks</h6>
              <p className="small">You're all caught up!</p>
            </div>
          )}
        </Col>
        <Col xs={12} lg={6}>
          {recentActivityData.length > 0 ? (
            <RecentActivity activities={recentActivityData} />
          ) : (
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center text-muted h-100 d-flex flex-column justify-content-center">
              <FiActivity size={40} className="mb-2 opacity-50 mx-auto" />
              <h6>No Recent Activity</h6>
              <p className="small">Your recent actions will appear here.</p>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;