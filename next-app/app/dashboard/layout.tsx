import type { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <DashboardHeader />
            {children}
        </>
    )
}
