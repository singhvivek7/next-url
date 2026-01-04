import { Plan } from "@/hooks/use-plans"

export interface IProfile {
    id: string
    email: string
    password: string
    name: string
    role: string
    username: string
    avatar: string
    plan: string
    plan_id?: string | null
    plan_details?: Plan | null
    created_at: string
    updated_at: string
}

export interface IProfileData {
    message: string
    data: IProfile
}