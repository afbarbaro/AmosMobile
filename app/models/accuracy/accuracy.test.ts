import { AccuracyModel } from "./accuracy"

test("can be created", () => {
  const instance = AccuracyModel.create({
    symbol: "BTC",
    band: { "2020-01-01": [95, 100, 105, 102], "2020-01-02": [96, 101, 106, 103] },
  })

  expect(instance).toBeTruthy()
})
