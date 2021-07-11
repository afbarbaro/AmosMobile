import { ForecastSnapshot, TimeseriesSnapshot } from "../../models/forecast/forecast"
import { Api } from "."
import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"

type Data = {
  source: {
    forecastName: string
    forecastArn: string
  }
  predictions: Record<string, TimeseriesSnapshot>
  historical: TimeseriesSnapshot
}

export type ForecastApiResponse = { kind: "ok"; forecast: ForecastSnapshot } | GeneralApiProblem

export class ForecastApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getForecast(
    symbol: string,
    dateRange?: [number | Date, number | Date],
  ): Promise<ForecastApiResponse> {
    try {
      // parameters
      const params: Record<string, unknown> = { symbol }
      if (dateRange) {
        params.startDate = dateRange[0]
        params.endDate = dateRange[1]
      }

      // make the api call
      const response = await this.api.apisauce.get<Data, unknown>("lookup", params)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        return problem
      }

      const forecast: ForecastSnapshot = {
        symbol,
        predictions: response.data?.predictions,
        historical: response.data?.historical,
        fetchedAt: Date.now(),
      }

      return { kind: "ok", forecast }
    } catch (e) {
      __DEV__ && console.tron.log?.(e.message)
      return { kind: "bad-data" }
    }
  }
}
