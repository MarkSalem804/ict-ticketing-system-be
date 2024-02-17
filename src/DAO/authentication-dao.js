const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function getAllUsers() {
  try {
    const user = await prisma.users.findMany();

    return user;
  } catch (error) {
    console.error("Error fetching users", error);
    throw new Error(error);
  }
}




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
      otp: otp,
    }
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

async function findUserByOTP(otp) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        otp: otp,
      },
    });
    return user;
  } catch (error) {
    console.error("Error Matching OTP", error);
    throw new Error(error);
  }
}

module.exports = {
  getAllUsers,
  findUserByOTP,
  createUser,
  findUserByEmail,
  updateUserOTP,
  updateUserPassword,
};
