import { ForecastStoreModel } from "./forecast-store"

test("can be created", () => {
  const instance = ForecastStoreModel.create({})

  expect(instance).toBeTruthy()
})
