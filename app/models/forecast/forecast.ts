import { SnapshotOut, types } from "mobx-state-tree"

const TimeseriesModel = types.array(
  types.model("Timeseries", {
    Timestamp: types.string,
    Value: types.number,
  }),
)
export interface TimeseriesSnapshot extends SnapshotOut<typeof TimeseriesModel> {}

export const ForecastModel = types.model("Forecast").props({
  symbol: types.identifier,
  predictions: types.frozen(types.map(TimeseriesModel)),
  historical: types.frozen(TimeseriesModel),
  fetchedAt: types.optional(types.number, 0),
})
export interface ForecastSnapshot extends SnapshotOut<typeof ForecastModel> {}
