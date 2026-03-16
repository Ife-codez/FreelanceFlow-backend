import { prisma } from "../config/db.js";

// POST /api/clients
const addClient = async (req, res) => {
  const { clientName, companyName, email, phone } = req.body;
  const userId = req.user.id; // from your auth middleware


  try {
    const client = await prisma.client.create({
      data: {
        clientName,
        companyName,
        email,
        phone,         // optional, can be undefined
        userId,        // links this client to the logged-in user
      },
    });

    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/clients
const getClients = async (req, res) => {
  const userId = req.user.id;

  try {
    const clients = await prisma.client.findMany({
      where: { userId },          // only fetch THIS user's clients
      orderBy: { createdAt: "desc" },
      include: {
        projects: true,           // optionally include related projects
      },
    });

    res.status(200).json({ clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/clients/:id
const getClient = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { projects: true },
    });

    // Check it exists AND belongs to this user
    if (!client || client.userId !== userId) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/clients/:id
const deleteClient = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    // First verify the client exists and belongs to this user
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client || client.userId !== userId) {
      return res.status(404).json({ message: "Client not found" });
    }

    await prisma.client.delete({ where: { id } });

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { addClient, getClients, getClient, deleteClient };