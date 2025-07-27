import db from "@/lib/db";

export const getUserWithEmail = async (email: string) => {
  const result = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      phone: true,
      address: true,
      detailaddress: true,
      username: true,
    },
  });
  return result;
};
