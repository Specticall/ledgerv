import { prisma } from "../config/config";

const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      userId: id,
    },
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUser = async (data: {
  email: string;
  name: string;
  profilePictureUrl: string;
}) => {
  return prisma.user.create({
    data,
  });
};

export default { getUserById, getUserByEmail, createUser };
