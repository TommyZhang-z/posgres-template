import { type PGlite } from "@electric-sql/pglite";

export const useQuery = (db: PGlite, noDrop: boolean = true) => {
  return [
    async (file: string) => {
      try {
        const sqlFile = await Bun.file(file).text();
        const cleanedSql = sqlFile
          .split("\n")
          .filter(
            (line) =>
              !line.includes("\\! echo") &&
              (!noDrop || !line.startsWith("DROP"))
          )
          .join("\n");

        await db.query(cleanedSql);
        console.log("Database initialized successfully.");
      } catch (error) {
        console.error("Error initializing the database:", error);
      }
    },
    async (query: string) => {
      try {
        const res = await db.query(query);
        console.log("Query results:", res);
      } catch (error) {
        console.error("Error fetching mission data:", error);
      }
    },
  ];
};
