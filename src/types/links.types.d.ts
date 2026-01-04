export interface ILink {
    id: string
    title: string
    description: string
    _count: { clicks: number }
    click: any[]
    graph?: {
        date: string
        count: number
    }[]
    locations?: { _id: string, count: number }[]
    devices?: { _id: string, count: number }[]
    os?: { _id: string, count: number }[]
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