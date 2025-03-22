import { persistenceRepository } from "@/backend/persistence-repositories";
import {
  and,
  asc,
  desc,
  eq,
  like,
  or,
} from "@/backend/persistence/database-drivers/persistence-where-operator";

import { NextResponse } from "next/server";

export async function GET() {
  // const users = await persistenceRepository.user.findRows({
  //   where: and(
  //     eq("id", "1"),
  //     like("email", "%+test%"),
  //     eq("name", "Rayhan"),
  //     or(eq("id", "1"), eq("id", "2"))
  //   ),
  //   columns: ["id", "name", "username", "email", "profile_photo", "created_at"],
  //   orderBy: [desc("created_at")],
  // });

  // const createUser = await persistenceRepository.user.createOne({
  //   name: "Rayhan",
  //   username: "rayhan",
  //   email: "rayhan1+test@gmail.com",
  //   profile_photo:
  //     "https://res.cloudinary.com/techdiary-dev/image/upload/v1620782237/static-assets/profile-photos/rayhan.jpg",
  //   education: "BSc Computer Science",
  //   designation: "Software Engineer",
  //   bio: "I am a software engineer with a passion for building scalable and efficient software solutions. I have a strong background in computer science and have experience working with various programming languages and frameworks. I am also a self-taught developer and have a keen interest in learning new technologies and techniques.",
  // });

  const updatedUser = await persistenceRepository.user.updateOne({
    where: like("email", "%+test%"),
    data: {
      name: "Updated names",
    },
  });

  return NextResponse.json({ updatedUser });
}
