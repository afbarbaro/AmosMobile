import { SnapshotOut, types } from "mobx-state-tree"

/**
 * Symbol model.
 */
export const SymbolModel = types.model("Symbol").props({
  name: types.string,
})

// export interface Symbol extends Instance<typeof SymbolModel> {}
export interface SymbolSnapshot extends SnapshotOut<typeof SymbolModel> {}
