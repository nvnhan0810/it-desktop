import { createPost, PostDataRequest } from "@/apis/post.apis";
import PostContentPreview from "@/components/post-content-preview";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Rss } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    title: z.string(),
    tags: z.string(),
    is_published: z.boolean(),
    published_at: z.date().nullable().transform((value) => value ?? null),
    content: z.string(),
})

export const PostNewPage = () => {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            is_published: true,
        }
    })

    const doc = useWatch({name: 'content', control: form.control});

    function handleDateSelect(date: Date | undefined) {
        if (date) {
            form.setValue("published_at", date);
        }
    }

    function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
        const currentDate = form.getValues("published_at") || new Date();
        const newDate = new Date(currentDate);

        if (type === "hour") {
            const hour = parseInt(value, 10);
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10));
        } else if (type === "ampm") {
            const hours = newDate.getHours();
            if (value === "AM" && hours >= 12) {
                newDate.setHours(hours - 12);
            } else if (value === "PM" && hours < 12) {
                newDate.setHours(hours + 12);
            }
        }

        form.setValue("published_at", newDate);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await createPost(values as PostDataRequest);

        if (res.status == 200) {
            navigate('/');
        }
    }

    return (
        <div className="py-3 px-4">
            <div className="flex items-center justify-between gap-3 mb-6">
                <Link to="/">
                    <Rss size={20} />
                </Link>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="mb-4 grid w-full items-center gap-1.5">
                                    <FormLabel htmlFor="title">Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input id="title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem className="mb-4 grid w-full items-center gap-1.5">
                                    <FormLabel htmlFor="tags">Tags</FormLabel>
                                    <FormControl>
                                        <Input id="tags" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mb-4 grid w-full items-center gap-1.5">
                            <FormField
                                control={form.control}
                                name="is_published"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Switch id="is_published" checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel htmlFor="is_published">Xuất bản</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="published_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "MM/dd/yyyy hh:mm aa")
                                                        ) : (
                                                            <span>MM/DD/YYYY hh:mm aa</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <div className="sm:flex">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={handleDateSelect}
                                                        initialFocus
                                                    />
                                                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                                        <ScrollArea className="w-64 sm:w-auto">
                                                            <div className="flex sm:flex-col p-2">
                                                                {Array.from({ length: 12 }, (_, i) => i + 1)
                                                                    .reverse()
                                                                    .map((hour) => (
                                                                        <Button
                                                                            key={hour}
                                                                            size="icon"
                                                                            variant={
                                                                                field.value &&
                                                                                    field.value.getHours() % 12 === hour % 12
                                                                                    ? "default"
                                                                                    : "ghost"
                                                                            }
                                                                            className="sm:w-full shrink-0 aspect-square"
                                                                            onClick={() =>
                                                                                handleTimeChange("hour", hour.toString())
                                                                            }
                                                                        >
                                                                            {hour}
                                                                        </Button>
                                                                    ))}
                                                            </div>
                                                            <ScrollBar
                                                                orientation="horizontal"
                                                                className="sm:hidden"
                                                            />
                                                        </ScrollArea>
                                                        <ScrollArea className="w-64 sm:w-auto">
                                                            <div className="flex sm:flex-col p-2">
                                                                {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                                                    (minute) => (
                                                                        <Button
                                                                            key={minute}
                                                                            size="icon"
                                                                            variant={
                                                                                field.value &&
                                                                                    field.value.getMinutes() === minute
                                                                                    ? "default"
                                                                                    : "ghost"
                                                                            }
                                                                            className="sm:w-full shrink-0 aspect-square"
                                                                            onClick={() =>
                                                                                handleTimeChange("minute", minute.toString())
                                                                            }
                                                                        >
                                                                            {minute.toString().padStart(2, "0")}
                                                                        </Button>
                                                                    )
                                                                )}
                                                            </div>
                                                            <ScrollBar
                                                                orientation="horizontal"
                                                                className="sm:hidden"
                                                            />
                                                        </ScrollArea>
                                                        <ScrollArea className="">
                                                            <div className="flex sm:flex-col p-2">
                                                                {["AM", "PM"].map((ampm) => (
                                                                    <Button
                                                                        key={ampm}
                                                                        size="icon"
                                                                        variant={
                                                                            field.value &&
                                                                                ((ampm === "AM" &&
                                                                                    field.value.getHours() < 12) ||
                                                                                    (ampm === "PM" &&
                                                                                        field.value.getHours() >= 12))
                                                                                ? "default"
                                                                                : "ghost"
                                                                        }
                                                                        className="sm:w-full shrink-0 aspect-square"
                                                                        onClick={() => handleTimeChange("ampm", ampm)}
                                                                    >
                                                                        {ampm}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="flex gap-1.5">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="grid w-full items-center gap-1.5">
                                            <FormLabel htmlFor="content">Nội dung</FormLabel>
                                            <FormControl>
                                                <Textarea className="field-sizing-content" id="content" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="rounded border px-3 py-2 markdown-body !text-sm">
                                <PostContentPreview doc={doc} />
                            </div>
                        </div>

                        <div className="space-x-2">
                            <Button type="button" variant="ghost" onClick={() => navigate('/')}>Quay lại</Button>
                            <Button type="submit">Tạo mới</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}