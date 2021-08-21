import { SnapshotOut, types } from "mobx-state-tree"

/**
 * Symbol model.
 */
export const SymbolModel = types.model("Symbol").props({
  ticker: types.string,
  name: types.string,
  description: types.string,
})

// export interface Symbol extends Instance<typeof SymbolModel> {}
export interface SymbolSnapshot extends SnapshotOut<typeof SymbolModel> {}
