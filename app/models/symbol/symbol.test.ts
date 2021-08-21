import { SymbolModel } from "./symbol"

test("can be created", () => {
  const instance = SymbolModel.create({
    ticker: "AMZN",
    name: "Amazon.com Inc",
    description:
      "For over 15 years, Amazon Web Services has been the world’s most comprehensive and broadly adopted cloud offering.",
  })

  expect(instance).toBeTruthy()
})
