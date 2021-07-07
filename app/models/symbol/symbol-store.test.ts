import { SymbolStoreModel } from "./symbol-store"

test("can be created", () => {
  const instance = SymbolStoreModel.create({})

  expect(instance).toBeTruthy()
})
