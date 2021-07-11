import { flow, SnapshotOut, types } from "mobx-state-tree"
import { ForecastModel } from "./forecast"
import { ForecastApi, ForecastApiResponse } from "../../services/api/forecast-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store forecasts
 */
export const ForecastStoreModel = types
  .model("ForecastStore")
  .props({
    forecasts: types.optional(types.array(ForecastModel), []),
  })
  .extend(withEnvironment)
  .views((self) => ({
    getForecast(symbol: string) {
      return self.forecasts.find((forecast) => forecast.symbol === symbol)
    },
  }))
  .actions((self) => ({
    fetchForecast: flow(function* fetchForecast(symbol: string) {
      const forecastApi = new ForecastApi(self.environment.api)
      const result: ForecastApiResponse = yield forecastApi.getForecast(symbol)

      if (result.kind === "ok") {
        const snapshot = result.forecast
        const existing = self.forecasts.findIndex((forecast) => forecast.symbol === snapshot.symbol)
        if (existing >= 0) self.forecasts[existing] = snapshot
        else self.forecasts.push(snapshot)
      } else {
        __DEV__ && console.tron.log?.(result.kind)
      }
    }),
  }))

export interface ForecastStoreSnapshot extends SnapshotOut<typeof ForecastStoreModel> {}
export const createForecastStoreDefaultModel = () => types.optional(ForecastStoreModel, {})
