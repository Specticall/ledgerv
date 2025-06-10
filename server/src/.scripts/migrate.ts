const args = process.argv.slice(2);

async function migrate() {
  const { execa } = await import("execa");

  try {
    await execa("npx", ["prisma", "migrate", ...args], {
      stdio: "inherit",
      env: process.env,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
