import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";

// GET /api/tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
export const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch task correspondinf to this id" });
  }
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response) => {
  console.log("req", req);
  const { title, description, status, priority, assignee_id, due_date } =
    req.body;

  // Handle uploaded file
  const file = req.file;
  const attachment_url = file ? `/uploads/${file.filename}` : null;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        due_date: new Date(due_date),
        assignee: { connect: { id: assignee_id } },
        attachment_url,
      },
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    priority,
    assignee_id,
    due_date,
    attachment_url,
  } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        status,
        priority,
        due_date: new Date(due_date),
        attachment_url,
        assignee: { connect: { id: assignee_id } },
      },
    });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id", id);
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid task ID" });
  }
  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const uploadTaskAttachment = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        attachmentUrl: `/uploads/${file.filename}`, // Or your storage path
      },
    });

    res.status(200).json({ message: "File uploaded", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};
