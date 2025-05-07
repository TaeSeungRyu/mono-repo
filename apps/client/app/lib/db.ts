import Database from "better-sqlite3";
import fs from "fs";
const INIT_FILE = "db_init.lock"; // 초기화 체크 파일

const SqlLiteDB = new Database("sample.db", { verbose: console.log }); //DB 생성

const tableArray = [
  {
    name: "User",
    columns: [
      { name: "username", type: "TEXT", constraint: "NOT NULL" },
      { name: "password", type: "TEXT", constraint: "NOT NULL" },
      { name: "name", type: "TEXT", constraint: "NOT NULL" },
    ],
  },
  {
    name: "CashedTable",
    columns: [
      { name: "title", type: "TEXT", constraint: "NOT NULL" },
      { name: "description", type: "TEXT", constraint: "NOT NULL" },
      { name: "number", type: "INTEGER", constraint: "NOT NULL" },
    ],
  },
  {
    name: "board",
    columns: [
      {
        name: "idx",
        type: "INTEGER",
        constraint: "PRIMARY KEY AUTOINCREMENT",
      },
      { name: "title", type: "TEXT", constraint: "NOT NULL" },
      { name: "contents", type: "TEXT", constraint: "NOT NULL" },
      { name: "username", type: "TEXT", constraint: "NOT NULL" },
      { name: "reg_date", type: "TEXT", constraint: "NOT NULL" },
    ],
  },
];

// 초기화 체크 파일이 없으면 아래 코드 동작(저어엉말 db도 쓸꺼면 서버 초기 런타임에 추가하는 방법으로 분리!)
if (!fs.existsSync(INIT_FILE)) {
  tableArray.forEach((table) => {
    const columns = table.columns
      .map((column) => {
        return `${column.name} ${column.type} ${column.constraint}`;
      })
      .join(", ");

    const tableExists: any = SqlLiteDB.prepare(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name=?"
    ).get(`${table.name}`);

    if (tableExists && tableExists?.count > 0) {
      console.log("table name : ", table.name);
    } else {
      SqlLiteDB.exec(`CREATE TABLE ${table.name} (${columns})`); // 테이블 생성
      if (table.name === "User") {
        SqlLiteDB.exec(
          "INSERT INTO User (username, password, name) VALUES ('admin', 'admin', '관리자')"
        ); // 데이터 삽입
      } else if (table.name === "CashedTable") {
        SqlLiteDB.exec(
          "INSERT INTO CashedTable (title, description, number) VALUES ('title data1', 'description 1', 1000)"
        ); // 데이터 삽입
        SqlLiteDB.exec(
          "INSERT INTO CashedTable (title, description, number) VALUES ('title data2', 'description 2', 2000)"
        ); // 데이터 삽입
      }
    }
  });
  fs.writeFileSync(INIT_FILE, "initialized");
}

export default SqlLiteDB;
