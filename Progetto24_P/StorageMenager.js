import * as SQLite from 'expo-sqlite'


export default class StorageMenager {
    constructor() {
        this.db = SQLite.openDatabase("newDb");
        this.createTable();
    }

    createTable() {
        const transaction = (tx) => {
            let query1 = "CREATE TABLE IF NOT EXISTS User(uid INT, name TEXT, picture TEXT, weapon INT, amulet INT, armor INT, life INT, experience INT, profileversion INT, positionshare BOOL, lat DOUBLE, lon DOUBLE, PRIMARY KEY(uid, profileversion))";
            let query2 = "CREATE TABLE IF NOT EXISTS Object(id INT PRIMARY KEY, type TEXT, level INT, lat DOUBLE, lon DOUBLE, name TEXT, image TEXT)";
            tx.executeSql(query1, [], (tx, queryResult) => {
                console.log("result query create User table", queryResult);
            }, (tx, error) => {
                console.log("error query create User table", error);
            });
            tx.executeSql(query2, [], (tx, queryResult) => {
                console.log("result query create Object table", queryResult);
            }, (tx, error) => {
                console.log("error query create Object table", error);
            });
        }
        this.db.transaction(transaction);
    }

    async insertUser(uid, name, picture, weapon, armor, amulet, life, experience, profileversion, positionshare, lat, lon) {
        const querySql = "INSERT INTO User VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
        const query = {args: [uid, name, picture, weapon, armor, amulet, life, experience, profileversion, positionshare, lat, lon], sql: querySql};
        const result = await this.db.execAsync([query], false);
        console.log("StorageMenager: insertUser - ", result);
    }

    async getUser(uid, profileversion) {
        const querySql = "SELECT * FROM User WHERE uid = ? AND profileversion = ?";
        const query = {args: [uid, profileversion], sql: querySql};
        const result = await this.db.execAsync([query], true);
        console.log("StorageMenager: getUser - ", JSON.stringify(result[0].rows[0] == undefined ? "" : "getUser succeded"));
        return result[0].rows[0] == undefined ? "" : result[0].rows[0];
    }

    async insertObject(id, type, level, lat, lon, name, image) {
        const querySql = "INSERT INTO Object VALUES(?,?,?,?,?,?,?)";
        const query = {args: [id, type, level, lat, lon, name, image], sql: querySql};
        const result = await this.db.execAsync([query], false);
        console.log("StorageMenager: insertObject - ", result);
        return result;
    }

    async getObject(id) {
        const querySql = "SELECT * FROM Object WHERE id = ?";
        const query = {args: [id], sql: querySql};
        const result = await this.db.execAsync([query], true);
        console.log("StorageMenager: getObject - ", result[0].rows[0] == undefined ? "" : "getObject succeded");
        return result[0].rows[0] == undefined ? "" : result[0].rows[0];
    }
}