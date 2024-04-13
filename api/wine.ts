import type { NuxtAxiosInstance } from "@nuxtjs/axios";
import { ApiResponse } from "./repository"
import { Wine, Bottle, StoreLocation, StoreItem } from "~/lib/Wine"

export interface IWineApi {
   getWines(params: string[] | undefined): Promise<ApiResponse<Wine[]>>
   get (id: number): Promise<ApiResponse<Wine>>
   put (wine: Wine): Promise<ApiResponse<Wine>>
   putBottle (bottle: Bottle): Promise<ApiResponse<Bottle>>
   patchBottle (bottle: Bottle): Promise<ApiResponse<Bottle>>
   getBottles (wineId: number): Promise<ApiResponse<Bottle[]>>
   getStore (id: number, binId: number | undefined): Promise<ApiResponse<StoreLocation[]>>
   getBinList (storeId: number, binId: number): Promise<ApiResponse<StoreItem[]>>
 }

export class WineApi implements IWineApi {
   private _baseApiUrl: string
   private _axios: NuxtAxiosInstance

   constructor (baseApiUrl: string, axios: NuxtAxiosInstance) {
      this._baseApiUrl = baseApiUrl + '/wine/'
      this._axios = axios
   }

   async get (id: number): Promise<ApiResponse<Wine>> {
      try {
         const result = await this._axios.get(this._baseApiUrl + `?id=${id}`)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to get wine' }
      }
   }

   async put (wine: Wine): Promise<ApiResponse<Wine>> {
      try {
         const result = await this._axios.put(this._baseApiUrl, wine)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to put wine' }
      }
   }

   async putBottle (bottle: Bottle): Promise<ApiResponse<Bottle>> {
      try {
         const result = await this._axios.put(this._baseApiUrl + `bottles/`, bottle)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to put bottle' }
      }
   }

   async patchBottle (bottle: Bottle): Promise<ApiResponse<Bottle>> {
      try {
         const result = await this._axios.patch(this._baseApiUrl + `bottles/`, bottle)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to put bottle' }
      }
   }

   async getWines (params: string[] | undefined): Promise<ApiResponse<Wine[]>> {
      if (!params) {
         try {
            const result = await this._axios.get(this._baseApiUrl)
            return result.data
         } catch (err) {
            return { success: false, message: 'Failed to get wine list' }
         }
      }

      const queryParams = params.join('&')
      try {
         const result = await this._axios.get(this._baseApiUrl + `?${queryParams}`)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to get wine list' }
      }
   }

   async getBottles (wineId: number): Promise<ApiResponse<Bottle[]>> {
      try {
         const result = await this._axios.get(this._baseApiUrl + `bottles/?wineid=${wineId}`)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to get bottles' }
      }
   }

   async getStore (id: number): Promise<ApiResponse<StoreLocation[]>> {
      try {
         const result = await this._axios.get(this._baseApiUrl + `store/?id=${id}`)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to get wine store' }
      }
   }

   async getBinList (storeId: number, binId: number): Promise<ApiResponse<StoreItem[]>> {
      try {
         const result = await this._axios.get(this._baseApiUrl + `store/?id=${storeId}&binid=${binId}`)
         return result.data
      } catch (err) {
         return { success: false, message: 'Failed to get bin listing'}
      }
   }
}
