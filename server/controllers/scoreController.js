const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Computes a productivity score purely from task data.
 *
 * Scoring rules:
 *   - Completing a regular task       →  10 points
 *   - Completing an important task    →  25 points
 *
 * The score is calculated dynamically each time it is requested,
 * so it always reflects the current state of the user's tasks.
 */
const getScore = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { completed: true }
    });

    let score = 0;
    for (const task of tasks) {
      score += task.isImportant ? 25 : 10;
    }

    const completedImportant = tasks.filter(t => t.isImportant).length;
    const completedRegular   = tasks.filter(t => !t.isImportant).length;

    res.json({
      value: score,
      breakdown: {
        completedRegular,
        completedImportant
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch score' });
  }
};

module.exports = {
  getScore
};
