import { prisma } from "../config/db.js";

// POST /api/payments
const addPayment = async (req, res) => {
  const { invoiceNumber, amount, dueDate, status, projectId } = req.body;

  try {
    // ✅ include client so we can traverse project → client → userId
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true },
    });

    if (!project || project.client.userId !== req.user.id) {
      return res.status(404).json({ message: "Project not found" });
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceNumber,
        amount,
        dueDate ,
        status, 
        project: {
          connect: { id: projectId }
        }
      },
    });

    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments
const getPayments = async (req, res) => {
  const userId = req.user.id;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        project: {
          client: { userId }, // ✅ payment → project → client → userId
        },
      },
      orderBy: { dueDate: "desc" }, // ✅ dueDate exists on Payment
      include: {
        project: true,
      },
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments/:id
const getPayment = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        project: {
          include: { client: true }, // ✅ nest the include to reach client
        },
      },
    });

    // ✅ correct variable name and correct traversal
    if (!payment || payment.project.client.userId !== userId) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/payments/:id
const deletePayment = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        project: {
          include: { client: true }, // ✅ need to reach userId
        },
      },
    });

    // ✅ correct variable name and correct traversal
    if (!payment || payment.project.client.userId !== userId) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await prisma.payment.delete({ where: { id } });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { addPayment, getPayments, getPayment, deletePayment }; // ✅ correct names