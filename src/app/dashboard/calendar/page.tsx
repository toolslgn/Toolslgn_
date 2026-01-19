"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { formatWIB } from "@/lib/timezone";
import { isHoliday, getHolidayColor } from "@/lib/holidays-2026";
import { getHolidayPostUrl } from "@/lib/holiday-greetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Clock, XCircle, Calendar as CalendarIcon, Flag, Sparkles } from "lucide-react";
import Link from "next/link";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { EmptyCalendar } from "@/components/empty-state";

const localizer = momentLocalizer(moment);

interface PostSchedule {
    id: string;
    scheduled_at: string;
    published_at?: string;
    status: "QUEUED" | "PUBLISHED" | "FAILED";
    platform_post_id?: string;
    posts: {
        caption: string;
        image_url?: string;
    };
    accounts: {
        platform: string;
        account_name: string;
    };
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    status: "QUEUED" | "PUBLISHED" | "FAILED";
    resource: PostSchedule;
}

export default function CalendarPage() {
    const [schedules, setSchedules] = useState<PostSchedule[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Fetch schedules
    useEffect(() => {
        async function fetchSchedules() {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("post_schedules")
                .select(
                    `
          id,
          scheduled_at,
          published_at,
          status,
          platform_post_id,
          posts (
            caption,
            image_url
          ),
          accounts (
            platform,
            account_name
          )
        `
                )
                .order("scheduled_at", { ascending: true });

            if (!error && data) {
                setSchedules(data as any);

                // Convert to calendar events
                const calendarEvents: CalendarEvent[] = data.map((schedule: any) => {
                    const scheduledDate = new Date(schedule.scheduled_at);
                    return {
                        id: schedule.id,
                        title: schedule.accounts?.account_name || "Unknown",
                        start: scheduledDate,
                        end: scheduledDate,
                        status: schedule.status,
                        resource: schedule,
                    };
                });

                setEvents(calendarEvents);
            }

            setLoading(false);
        }

        fetchSchedules();
    }, []);

    // Handle date click
    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);

        // Check if this is a holiday
        const holiday = isHoliday(date);

        // Filter events for selected date
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayEvents = events.filter((event) => {
            const eventDate = new Date(event.start);
            return eventDate >= dayStart && eventDate <= dayEnd;
        });

        setSelectedDateEvents(dayEvents);
        setDialogOpen(true);
    };

    // Custom event style
    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = "#fbbf24"; // Yellow (Queued)
        let borderColor = "#f59e0b";

        if (event.status === "PUBLISHED") {
            backgroundColor = "#10b981"; // Green
            borderColor = "#059669";
        } else if (event.status === "FAILED") {
            backgroundColor = "#ef4444"; // Red
            borderColor = "#dc2626";
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                borderWidth: "2px",
                borderStyle: "solid",
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
            },
        };
    };

    // Custom day cell component with holiday indicator
    const DayCell = ({ value }: { value: Date }) => {
        const holiday = isHoliday(value);

        if (!holiday) return null;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="absolute top-1 right-1">
                            <Flag className={`h-3 w-3 ${getHolidayColor(holiday.type)}`} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-semibold">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">{holiday.nameEn}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };
    // Get status config
    const getStatusConfig = (status: string) => {
        if (status === "PUBLISHED") {
            return {
                icon: CheckCircle2,
                color: "text-green-500",
                bgColor: "bg-green-500/10",
                label: "Published",
                variant: "default" as const,
            };
        } else if (status === "FAILED") {
            return {
                icon: XCircle,
                color: "text-red-500",
                bgColor: "bg-red-500/10",
                label: "Failed",
                variant: "destructive" as const,
            };
        } else {
            return {
                icon: Clock,
                color: "text-yellow-500",
                bgColor: "bg-yellow-500/10",
                label: "Queued",
                variant: "secondary" as const,
            };
        }
    };

    // Group events by date for agenda view
    const groupedEvents = events.reduce((groups, event) => {
        const date = moment(event.start).format("YYYY-MM-DD");
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {} as Record<string, CalendarEvent[]>);

    const sortedDates = Object.keys(groupedEvents).sort();

    // Get date label
    const getDateLabel = (dateStr: string) => {
        const date = moment(dateStr);
        const today = moment().startOf("day");
        const tomorrow = moment().add(1, "day").startOf("day");

        if (date.isSame(today, "day")) {
            return "Today";
        } else if (date.isSame(tomorrow, "day")) {
            return "Tomorrow";
        } else if (date.isBefore(moment().add(7, "days"))) {
            return date.format("dddd, MMM D");
        } else {
            return date.format("MMM D, YYYY");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Loading calendar...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                <p className="text-muted-foreground mt-2">
                    {isMobile
                        ? "View your scheduled posts in agenda format"
                        : "View and manage your scheduled posts"}
                </p>
            </div>

            {/* Legend */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-yellow-500"></div>
                            <span className="text-sm">Queued</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                            <span className="text-sm">Published</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500"></div>
                            <span className="text-sm">Failed</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar / Agenda View */}
            {isMobile ? (
                /* Mobile: Agenda View */
                <div className="space-y-4">
                    {sortedDates.length === 0 ? (
                        <EmptyCalendar />
                    ) : (
                        sortedDates.map((dateStr) => {
                            const dateEvents = groupedEvents[dateStr];
                            return (
                                <Card key={dateStr}>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CalendarIcon className="h-5 w-5" />
                                            {getDateLabel(dateStr)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {dateEvents.map((event) => {
                                            const config = getStatusConfig(event.status);
                                            const Icon = config.icon;

                                            return (
                                                <div
                                                    key={event.id}
                                                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className={`rounded-full p-2 ${config.bgColor}`}>
                                                        <Icon className={`h-4 w-4 ${config.color}`} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium capitalize">
                                                                {event.resource.accounts?.platform}
                                                            </span>
                                                            <Badge variant={config.variant} className="text-xs">
                                                                {config.label}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {event.resource.accounts?.account_name}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {moment(event.start).format("HH:mm")} WIB
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            ) : (
                /* Desktop: Calendar View */
                <Card>
                    <CardContent className="pt-6">
                        <div style={{ height: "600px" }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                onSelectSlot={(slotInfo) => handleSelectDate(slotInfo.start)}
                                onSelectEvent={(event) =>
                                    handleSelectDate(new Date(event.start))
                                }
                                selectable
                                eventPropGetter={eventStyleGetter}
                                views={["month"]}
                                defaultView="month"
                                components={{
                                    dateCellWrapper: ({ value, children }) => (
                                        <div className="relative h-full">
                                            {children}
                                            <DayCell value={value} />
                                        </div>
                                    ),
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Date Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>
                                Posts for {selectedDate && moment(selectedDate).format("MMMM D, YYYY")}
                            </DialogTitle>

                            {/* Holiday Quick Action */}
                            {selectedDate && (() => {
                                const holiday = isHoliday(selectedDate);
                                if (holiday) {
                                    return (
                                        <Button asChild size="sm" className="ml-4">
                                            <Link href={getHolidayPostUrl(holiday, selectedDate)}>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Create Holiday Post
                                            </Link>
                                        </Button>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </DialogHeader>

                    <div className="space-y-3 mt-4">
                        {selectedDateEvents.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No posts scheduled for this date
                            </p>
                        ) : (
                            selectedDateEvents.map((event) => {
                                const config = getStatusConfig(event.status);
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 p-4 rounded-lg border border-border"
                                    >
                                        <div className={`rounded-full p-2 ${config.bgColor}`}>
                                            <Icon className={`h-4 w-4 ${config.color}`} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium capitalize">
                                                    {event.resource.accounts?.platform}
                                                </span>
                                                <Badge variant={config.variant}>{config.label}</Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-2">
                                                {event.resource.accounts?.account_name}
                                            </p>

                                            <p className="text-sm line-clamp-2 mb-2">
                                                {event.resource.posts?.caption}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Scheduled: {moment(event.start).format("HH:mm")} WIB
                                            </p>

                                            {event.resource.published_at && (
                                                <p className="text-xs text-muted-foreground">
                                                    Published:{" "}
                                                    {formatWIB(event.resource.published_at, false)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
