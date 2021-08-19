import { AccuracyStoreModel } from "./accuracy-store"

test("can be created", () => {
  const instance = AccuracyStoreModel.create({})

  expect(instance).toBeTruthy()
})
