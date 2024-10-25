import type { ApiConfig } from "./api.types"

import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "../../config"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  // setToken(token) {
  //   console.log("calisti")
  //   this.token = token
  //   console.log(this.token)
  //   this.axiosInstance.defaults.headers["Authorization"] = `Bearer ${this.token}`
  // }

  async getListProduct(): Promise<any[]> {
    const response: ApiResponse<any[]> = await this.apisauce.get("/products")
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error")
    }
    return response.data
  }

  async getDetailProduct(Id: any): Promise<any[]> {
    const response: ApiResponse<any[]> = await this.apisauce.get(`/products/${Id}`)
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error")
    }
    return response.data
  }

  async updateProduct(Id: string, data: any): Promise<any> {
    const response: ApiResponse<any> = await api.apisauce.put(`/products/${Id}`, data)
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error")
    }
    return response.data
  }
}

export const api = new Api()
