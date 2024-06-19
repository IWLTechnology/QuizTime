
const fs = require("fs");
const dbFile = "./.data/data.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
	.open({
		filename: dbFile,
		driver: sqlite3.Database
	})
	.then(async dBase => {
		db = dBase;

		try {
			if (!exists) {
				await db.run(
					"CREATE TABLE Highscores (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, name TEXT, correct TEXT, nofq TEXT)"
				);
				await db.run(
					"CREATE TABLE Counter (id INTEGER PRIMARY KEY AUTOINCREMENT, counter INTEGER)"
				);
				await db.run(
					"INSERT INTO Counter (counter) VALUES (0)"
				);
				for(var num = 10; num < 21; num++){
						await db.run(`INSERT INTO Highscores (time, name, correct, nofq) VALUES ('999999999', 'No Highscore', '0','${num}')`);
				}
			} else {

			}
		} catch (dbError) {
			console.error(dbError);
		}
	});

module.exports = {
	getHighscores: async () => {
		try {
			return await db.all("SELECT * from Highscores");
		} catch (dbError) {
			console.error(dbError);
		}
	},

	addHighscore: async data => {
		try {
			return await db.all(`UPDATE Highscores
SET name = '${data.name}', correct = '${data.correct}', time = '${data.time}'
WHERE nofq = '${data.nofq}';
`);

		} catch (dbError) {
			console.error(dbError);
		}
	},

	increaseCounter: async () => {
		try {
			await db.run(
				"UPDATE Counter SET counter = counter + 1"
			);
		} catch (dbError) {
			console.error(dbError);
		}
	},
	getCounter: async () => {
		try {
			return await db.all("SELECT counter from Counter");
		} catch (dbError) {
			console.error(dbError);
		}
	},
};
