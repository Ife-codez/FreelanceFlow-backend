import { prisma } from "../config/db.js";

// POST /api/projects
const addProject = async (req, res) => {
  const { projectTitle, description, budget, status, clientId } = req.body;

  try {
    // Verify the client exists and belongs to the logged-in user
    const client = await prisma.client.findUnique({ where: { id: clientId } });

    if (!client || client.userId !== req.user.id) {
      return res.status(404).json({ message: "Client not found" });
    }

    const project = await prisma.project.create({
      data: {
        projectTitle,
        description,
        budget,
        status,   
        client: {
          connect: { id: clientId } 
        }
      },
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects
const getProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const projects = await prisma.project.findMany({
      where: {
        client: { userId },
      },
      orderBy: { startDate: "desc" },
      include: {
        payments: true,
        client: true,
      },
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        payments: true,
        client: true,
      },
    });

    // ✅ ownership check via the client relation, not project.userId
    if (!project || project.client.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: true }, // ✅ need client to check ownership
    });

    // ✅ ownership check via the client relation, not project.userId
    if (!project || project.client.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.project.delete({ where: { id } });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { addProject, getProjects, getProject, deleteProject };