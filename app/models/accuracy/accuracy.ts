import { SnapshotOut, types } from "mobx-state-tree"

const AccuracyDataModel = types.array(types.number)
export interface AccuracyDataSnapshot extends SnapshotOut<typeof AccuracyDataModel> {}

export const AccuracyModel = types.model("Accuracy").props({
  symbol: types.identifier,
  band: types.frozen(types.map(AccuracyDataModel)),
  fetchedAt: types.optional(types.number, 0),
})
export interface AccuracySnapshot extends SnapshotOut<typeof AccuracyModel> {}
