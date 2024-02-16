const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser(data) {
  try {
    data.otp = parseInt(data.otp);

    const user = await prisma.users.create({
      data: data,
    });

    return user;
  } catch (error) {
    console.error("Error Creating User", error);
    throw new Error(error);
  }
}

async function findUserByEmail(email) {
  return await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
}

async function updateUserOTP(email, otp) {
  return await prisma.users.update({
    where: {
      email: email,
    },
    data: {
      otp: parseInt(otp),
    },
  });
}

async function updateUserPassword(email, newPassword) {
  return await prisma.users.update({
    where: {
      email: email,
    },
    data: {
      password: newPassword,
    },
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  updateUserOTP,
  updateUserPassword,
};
