import { Sparkles, Zap } from "lucide-react"
import { useState } from "react"

import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/use-profile";
import { UPGRADE_GRADIENT_STYLES } from "@/lib/constant/ui.constant";

export const UpgradeCard = () => {
    const { data } = useProfile();
    const [open, setOpen] = useState(false);

    if (data?.data?.plan !== "BASIC") return null;

    return (
        <>
            <div className="rounded-none bg-linear-to-br from-primary/10 to-secondary/10 p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                    Unlock unlimited links and advanced analytics
                </p>
                <Button
                    size="sm"
                    className={`w-full rounded-none gap-2 ${UPGRADE_GRADIENT_STYLES} border-0 hover:opacity-90 transition-opacity`}
                    onClick={() => setOpen(true)}
                >
                    <Zap className="h-3.5 w-3.5" />
                    Upgrade Now
                </Button>
            </div>

            <UpgradeDialog
                open={open}
                onOpenChange={setOpen}
                currentPlan={data?.data?.plan}
                user={{
                    name: data?.data.name,
                    email: data?.data.email
                }}
            />
        </>
    )
}