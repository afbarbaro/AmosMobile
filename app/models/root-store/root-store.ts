import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AccuracyStoreModel } from "../accuracy/accuracy-store"
import { ForecastStoreModel } from "../forecast/forecast-store"
import { SymbolStoreModel } from "../symbol/symbol-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  symbolStore: types.optional(SymbolStoreModel, {}),
  forecastStore: types.optional(ForecastStoreModel, {}),
  accuracyStore: types.optional(AccuracyStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
