import { ApiResponse } from "apisauce"
import { SymbolSnapshot } from "../../models/symbol/symbol"
import { Api } from "."
import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"

export class SymbolApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getSymbols(): Promise<{ kind: "ok"; symbols: SymbolSnapshot[] } | GeneralApiProblem> {
    try {
      // make the api call
      const response: ApiResponse<string[]> = await this.api.apisauce.get("symbols")

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        return problem
      }

      const symbols = response.data?.map((s) => ({ name: s })) || []

      return { kind: "ok", symbols }
    } catch (e) {
      __DEV__ && console.tron.log?.(e.message)
      return { kind: "bad-data" }
    }
  }
}
