import { PGlite } from "@electric-sql/pglite";

const sqlFragment = String.raw;
const db = new PGlite();

// Initialize the database with improved error handling and streamlined file processing
async function initializeDatabase() {
  try {
    const sqlFile = await Bun.file("./nasa2.txt").text();
    const cleanedSql = sqlFile
      .split("\n")
      .filter((line) => !line.includes("\\! echo") && !line.startsWith("DROP"))
      .join("\n");

    await db.query(cleanedSql);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
}

// Perform the query with enhanced readability
async function fetchMissionData() {
  try {
    const res = await db.query(sqlFragment`
	  SELECT 
		  a1.astrono AS commander,
		  a2.astrono AS pilot, ·
		  a1.missionno AS missionno
	  FROM 
		  nasa2_assigned AS a1
	  JOIN 
		  nasa2_assigned AS a2 ON a1.missionno = a2.missionno 
	  WHERE
		  a1.missionno LIKE 'STS-2%'
		  AND a1.role = 'Commander' 
		  AND a2.role = 'Pilot'
	`);
    console.log("Query results:", res);
  } catch (error) {
    console.error("Error fetching mission data:", error);
  }
}

// Run the functions
(async () => {
  await initializeDatabase();
  await fetchMissionData();
})();
