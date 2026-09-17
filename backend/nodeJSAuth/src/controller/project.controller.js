import { Project } from "../model/project.model.js";

export const addProject = async (req, res, next) => {

    try {
        const {
            projectName,
            description,
            priority,
            status,
            members,
            dueDate,
        } = req.body;

        const project = await Project.create({
            projectName,
            description,
            priority,
            status,
            members,
            dueDate,
            owner: req.user.sub,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: {
                project,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find();

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully!",
            data: projects,
        })
    } catch (error) {
        next(error);
    }
}

// export const getProjectsByUser = async (req, res, next) => {
//     try {
//         const loggedInUserId = req.user.sub;
//         const { userId } = req.body;
//         console.log("🚀 ~ getProjectsByUser ~ req.body:", req.body)
//         console.log("🚀 ~ getProjectsByUser ~ userId:", userId)

//         if(loggedInUserId !== userId){
//             return res.status(403).json({
//                 success: false,
//                 message: "Wrong user ID",
//                 data: []
//             });
//         }

//         const userProjects = await Project.find({ owner: loggedInUserId });
//         console.log("🚀 ~ getProjectsByUser ~ userProjects:", userProjects)

//         return res.status(200).json({
//             success: true,
//             message: "Projects fetched successfully",
//             data: userProjects
//         })
//     } catch (error) {
//         next(error);
//     }
// }

export const getProjectsByUser = async (req, res, next) => {
    try {
        const userId = req.user.sub;

        const userProjects = await Project.find({ owner: userId });

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            data: userProjects
        })
    } catch (error) {
        next(error);
    }
}

export const updateProject = async (req, res, next) => {
    try {
        const {
            projectId,
            projectName,
            description,
            priority,
            status,
            members,
            dueDate,
            owner
        } = req.body

        const loggedInUserId = req.user.sub;

        if (loggedInUserId !== owner) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this project",
                data: {}
            });
        }

        const updateData = {};

        if (projectName !== undefined) {
            updateData.projectName = projectName;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (priority !== undefined) {
            updateData.priority = priority;
        }

        if (status !== undefined) {
            updateData.status = status;
        }

        if (members !== undefined) {
            updateData.members = members;
        }

        if (dueDate !== undefined) {
            updateData.dueDate = dueDate;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true,
            });

        if (!updatedProject) {
            return res.status(400).json({
                success: false,
                message: "Project not found please enter valid project ID",
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project Updated succcessfully",
            data: { project: updatedProject }
        });

    } catch (error) {
        next(error);
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        // const deletedProject = await Project.findOneAndDelete({
        //     _id: id,
        //     owner: req.user.sub
        // });

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
                data: {}
            });
        }

        if (project.owner.toString() !== req.user.sub) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this project",
                data: {}
            });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(400).json({
                success: false,
                message: "Param id is missing",
                data: {}
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: { deletedProject }
        })

    } catch (error) {
        next(error);
    }
}