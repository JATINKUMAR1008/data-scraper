import { insertUser } from "./db";
import { User } from "./schema";

async function main() {
  const newUser: User = {
    firstName: "user",
    lastName: "user",
    email: "user@example.com"
  };
  const res = await insertUser(newUser);
  console.log("Sucessfully seeded users table:", res);
  process.exit();
}

main();
