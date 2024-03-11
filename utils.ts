import { type PGlite } from "@electric-sql/pglite";

export const sql = String.raw;

export function useQuery(db: PGlite, excludeDrops = true) {
  return {
    runFileQuery: (filePath: string) => async () => {
      try {
        const sqlFile = await Bun.file(filePath).text();
        const cleanedSql = sqlFile
          .split("\n")
          .filter(
            (line) =>
              !line.includes("\\! echo") &&
              (!excludeDrops || !line.startsWith("DROP"))
          )
          .join("\n");

        const res = await db.query(cleanedSql);
        console.log("Query results:", res);
      } catch (error) {
        console.error("Error initializing the database:", error);
      }
    },
    runQuery: (queryStr: string) => async () => {
      try {
        const res = await db.query(queryStr);
        console.log("Query results:", res);
      } catch (error) {
        console.error("Error fetching mission data:", error);
      }
    },
  };
}
