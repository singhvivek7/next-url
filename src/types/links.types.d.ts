export interface ILink {
    id: string
    clicks: any[]
    expires_at: string | null
    is_active: boolean
    original_url: string
    short_url: string
    created_at: string
    updated_at: string
}

export interface ILinks {
    message: string
    data: ILink[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}