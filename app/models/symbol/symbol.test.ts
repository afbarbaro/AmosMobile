import { SymbolModel } from "./symbol"

test("can be created", () => {
  const instance = SymbolModel.create({
    name: "BTC",
  })

  expect(instance).toBeTruthy()
})
