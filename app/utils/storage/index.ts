export * from "./storage"

export type Storage = {
  loadString(key: string): Promise<string | null>
  saveString(key: string, value: string): Promise<boolean>
  load(key: string): Promise<any | null>
  save(key: string, value: any): Promise<boolean>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}
