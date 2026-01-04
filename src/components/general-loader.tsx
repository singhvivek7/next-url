import { Loader2 } from "lucide-react"

interface GeneralLoaderProps {
    title?: string
    description?: string
}

export function GeneralLoader({
    title = "Loading...",
    description = "Please wait while we fetch your data."
}: GeneralLoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center h-full w-full">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-lg animate-pulse">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    )
}
