import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    showBreadcrumbs?: boolean;
}

export function PageHeader({
    title,
    description,
    actions,
    showBreadcrumbs = true,
}: PageHeaderProps) {
    return (
        <div className="space-y-2">
            {showBreadcrumbs && <Breadcrumbs />}

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground mt-1">{description}</p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
                )}
            </div>
        </div>
    );
}
