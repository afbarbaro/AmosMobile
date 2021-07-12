import { ForecastModel } from "./forecast"

test("can be created", () => {
  const instance = ForecastModel.create({
    symbol: "BTC",
    predictions: {
      median: [
        {
          Timestamp: "2020-01-03T00:00:00Z",
          Value: 100.0,
        },
        {
          Timestamp: "2020-01-04T00:00:00Z",
          Value: 101.0,
        },
      ],
      p90: [
        {
          Timestamp: "2020-01-03T00:00:00Z",
          Value: 200.0,
        },
        {
          Timestamp: "2020-01-04T00:00:00Z",
          Value: 210.0,
        },
      ],
    },
    historical: [
      {
        Timestamp: "2020-01-01T00:00:00Z",
        Value: 100.0,
      },
      {
        Timestamp: "2020-01-02T00:00:00Z",
        Value: 101.0,
      },
    ],
  })

  expect(instance).toBeTruthy()
})
