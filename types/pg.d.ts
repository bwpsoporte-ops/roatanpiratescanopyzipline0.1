declare module 'pg' {
  export interface QueryResult<R = Record<string, unknown>> {
    rows: R[];
    rowCount: number | null;
  }

  export class Pool {
    constructor(config: {
      connectionString: string;
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
    });
    query<R = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<R>>;
    end(): Promise<void>;
  }
}
