interface Authentication {
  userName: string;
  password: string;
  authDb: string;
}

export interface Connection {
  _id: string;
  name: string;
  server: string;
  port: string;
  authentication?: Authentication;
}

export interface Map<T> {
  [K: string]: T;
}

export interface Collection {
  connId?: string;
  dbList?: string[];
  dbName?: string;
  collList?: string[];
  collName?: string;
}

interface ProfileConnection {
  connId: string;
  dbName?: string;
  dbList?: [string];
  collName?: string;
  collList?: [string];
}

export interface Profile {
  _id?: string;
  name: string;
  source: ProfileConnection;
  target: ProfileConnection;
}
