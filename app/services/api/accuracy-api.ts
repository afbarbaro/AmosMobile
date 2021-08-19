import { AccuracySnapshot, AccuracyDataSnapshot } from "../../models/accuracy/accuracy"
import { Api } from "."
import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"

type Data = Record<string, AccuracyDataSnapshot> | { success: false }

export type AccuracyApiResponse = { kind: "ok"; accuracy: AccuracySnapshot } | GeneralApiProblem

export class AccuracyApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getAccuracy(
    symbol: string,
    dateRange?: [number | Date, number | Date],
  ): Promise<AccuracyApiResponse> {
    try {
      // parameters
      const params: Record<string, unknown> = { symbol }
      if (dateRange) {
        params.startDate = dateRange[0]
        params.endDate = dateRange[1]
      }

      // make the api call
      const response = await this.api.apisauce.get<Data, unknown>("accuracy", params)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        return problem
      } else if (response.data && "success" in response.data) {
        return { kind: "not-found" }
      }

      const accuracy: AccuracySnapshot = {
        symbol,
        band: response.data,
        fetchedAt: Date.now(),
      }

      return { kind: "ok", accuracy }
    } catch (e) {
      __DEV__ && console.tron.log?.(e.message)
      return { kind: "bad-data" }
    }
  }
}
