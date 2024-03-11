import { PGlite } from "@electric-sql/pglite";
import { sql, useQuery } from "./utils";

const db = new PGlite();

const { runQuery, runFileQuery } = useQuery(db);

(async () => {
  await runFileQuery("nasa2.txt");
  await runQuery(sql`
	  SELECT 
		  a1.astrono AS commander,
		  a2.astrono AS pilot,
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
})();
