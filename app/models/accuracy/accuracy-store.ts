import { flow, SnapshotOut, types } from "mobx-state-tree"
import { AccuracyModel } from "./accuracy"
import { AccuracyApi, AccuracyApiResponse } from "../../services/api/accuracy-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store accuracys
 */
export const AccuracyStoreModel = types
  .model("AccuracyStore")
  .props({
    accuracys: types.optional(types.array(AccuracyModel), []),
  })
  .extend(withEnvironment)
  .views((self) => ({
    getAccuracy(symbol: string) {
      return self.accuracys.find((accuracy) => accuracy.symbol === symbol)
    },
  }))
  .actions((self) => ({
    fetchAccuracy: flow(function* fetchAccuracy(symbol: string) {
      const accuracyApi = new AccuracyApi(self.environment.api)
      const result: AccuracyApiResponse = yield accuracyApi.getAccuracy(symbol)

      if (result.kind === "ok") {
        const snapshot = result.accuracy
        const existing = self.accuracys.findIndex((accuracy) => accuracy.symbol === snapshot.symbol)
        if (existing >= 0) self.accuracys[existing] = snapshot
        else self.accuracys.push(snapshot)
      } else {
        __DEV__ && console.tron.log?.(result.kind)
      }
    }),
  }))

export interface AccuracyStoreSnapshot extends SnapshotOut<typeof AccuracyStoreModel> {}
export const createAccuracyStoreDefaultModel = () => types.optional(AccuracyStoreModel, {})
