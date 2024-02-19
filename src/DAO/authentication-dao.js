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

async function findUserByOTP(otp) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        otp: parseInt(otp),
      },
    });
    return user;
  } catch (error) {
    console.error("Error Matching OTP", error);
    throw new Error(error);
  }
}

async function updateUserToken(email, token) {
  return await prisma.users.update({
    where: {
      email: email,
    },
    data: {
      token: token,
    },
  });
}

async function logUserLogin(ipAddress, email, isSuccess, message, token) {
  return await prisma.logs.create({
    data: {
      ipAddress: ipAddress,
      status: isSuccess ? 1 : 0, // Assuming 1 represents a successful login
      email: email,
      description: message,
      token: token,
    },
  });
}

async function logUserLogout(ipAddress, email) {
  try {
    const message = "User logged out";
    const isSuccess = true;

    const user = await prisma.logs.create({
      data: {
        ipAddress: ipAddress,
        email: email,
        description: message,
        status: isSuccess ? 0 : 1,
      },
    });
    return user;
  } catch (error) {
    console.error("Error Logging out", error);
    throw new Error(error);
  }
}

async function deleteUser(userId) {
  try {
    const user = await prisma.users.delete({
      where: {
        userId: parseInt(userId),
      },
    });
    return user;
  } catch (error) {
    console.error("Error Deleting user", error);
    throw new Error(error);
  }
}

module.exports = {
  deleteUser,
  logUserLogout,
  logUserLogin,
  updateUserToken,
  getAllUsers,
  findUserByOTP,
  createUser,
  findUserByEmail,
  updateUserOTP,
  updateUserPassword,
};
