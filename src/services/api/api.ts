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
  token: any

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

  setToken(token: string) {
    this.token = token
    this.apisauce.setHeader("Authorization", `Bearer ${token}`)
  }

  async getListPosts(): Promise<any[]> {
    const response: ApiResponse<any[]> = await this.apisauce.get("/posts")
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error")
    }
    return response.data
  }

  async getPostsSearch(query: string): Promise<any[]> {
    const response: ApiResponse<any[]> = await this.apisauce.get(`posts/search?q=${query}`)
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error")
    }
    return response.data
  }

  async getUser(Id: any): Promise<any[]> {
    const response: ApiResponse<any[]> = await this.apisauce.get(`/users/${Id}`)
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error")
    }
    return response.data
  }

  async login(username: string, password: string, expiresInMins = 30): Promise<any> {
    const response: ApiResponse<any> = await this.apisauce.post(
      "/auth/login",
      {
        username,
        password,
        expiresInMins,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false, // This will include cookies in the request
      },
    )
    if (!response.ok || !response.data) {
      throw new Error(response.problem || "API Error during login")
    }
    this.setToken(response.data.accessToken)
    return response.data
  }
}

export const api = new Api()
