import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<any>
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;
  constructor(){
    this.connection = pgp()("postgres://postgres:2806@localhost:5432/branasio");
  }

  async query(statement: string, params: any): Promise<any> {
    return await this.connection.query(statement, params)
  }

  async close(): Promise<any> {
    return await this.connection.$pool.end()
  }
}