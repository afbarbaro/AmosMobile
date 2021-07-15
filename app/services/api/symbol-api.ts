import { Api } from "."
import { SymbolSnapshot } from "../../models/symbol/symbol"
import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"

export class SymbolApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getSymbols(): Promise<{ kind: "ok"; symbols: SymbolSnapshot[] } | GeneralApiProblem> {
    // make the api call
    return this.api.apisauce.get<string[]>("symbols").then((response) => {
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
        else return { kind: "bad-data" }
      }
      const symbols = response.data?.map((s) => ({ name: s })) || []
      return { kind: "ok", symbols }
    })
  }
}
