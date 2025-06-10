import fs from "fs/promises";
import { z } from "zod";

/**
 * Global State Storage to be used across tests
 */
class TestDataStore {
  private static path = `${process.cwd()}/src/test/test-data/test-data.json`;
  private static schema = z.object({
    authCookies: z.object({
      userA: z.string(),
      userB: z.string(),
    }),
  });

  public static async get() {
    // Read the data
    const storeJSON = await fs.readFile(this.path, "utf-8");
    if (!storeJSON) {
      throw new Error(
        "Failed to read test login credential json, does the file exist?"
      );
    }

    // Parse and validate the credentials
    const storeRaw = JSON.parse(storeJSON);
    const store = this.schema.parse(storeRaw);

    return store;
  }

  public static async set(data: z.infer<typeof this.schema>) {
    // Write the data into the store
    await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
  }

  public static async clear() {
    await fs.writeFile(this.path, "", "utf-8");
  }
}

export default TestDataStore;
