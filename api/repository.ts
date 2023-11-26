import { IWineApi } from "./wine"

export interface ApiResponse<T> {
   success: boolean
   data?: T
   message?: string
}

export interface IRepository {
   wine: IWineApi
}