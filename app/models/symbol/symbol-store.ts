import { SnapshotOut, types } from "mobx-state-tree"
import { SymbolModel, SymbolSnapshot } from "../symbol/symbol"
import { SymbolApi } from "../../services/api/symbol-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store symbols
 */
export const SymbolStoreModel = types
  .model("SymbolStore")
  .props({
    symbols: types.optional(types.array(SymbolModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveSymbols: (symbolSnapshots: SymbolSnapshot[]) => {
      self.symbols.replace(symbolSnapshots)
    },
  }))
  .actions((self) => ({
    getSymbols: async () => {
      const symbolApi = new SymbolApi(self.environment.api)
      const result = await symbolApi.getSymbols()

      if (result.kind === "ok") {
        self.saveSymbols(result.symbols)
      } else {
        __DEV__ && console.tron.log?.(result.kind)
      }
    },
  }))

export interface SymbolStoreSnapshot extends SnapshotOut<typeof SymbolStoreModel> {}
export const createSymbolStoreDefaultModel = () => types.optional(SymbolStoreModel, {})
