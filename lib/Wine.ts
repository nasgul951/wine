export interface Wine {
    id?: number
    varietal: string
    vineyard: string
    label: string
    vintage?: number
    notes: string
    count?: number
}

export interface Bottle {
    id?: number
    wineId?: number
    storageId?: number,
    storageDescription?: string
    binX?: number
    binY?: number
    depth?: number,
    consumed?: boolean,
    consumedDate?: string
    createdDate?: string
}

export interface StoreItem {
    bottleid: number
    wineid: number
    vineyard: string
    label: string
    varietal: string
    vintage: number
    depth: number
}

export interface StoreLocation {
    binY: number
    binX: number
    binCount: number
}