import { editPost, fetchPost, PostDataRequest } from "@/apis/post.apis";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Post } from "@/types/post.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon, Rss } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    title: z.string(),
    tags: z.string(),
    is_published: z.boolean(),
    published_at: z.date().nullable().transform((value) => value ?? null),
    content: z.string(),
})

export const PostEditPage = () => {
    const params = useParams();

    const [post, setPost] = useState<Post>();

    useEffect(() => {
        const id = parseInt(params.id, 10);

        handleFetchPost({id});
    }, [params])

    const handleFetchPost = async ({id}:{id: number}) => {
        const res = await fetchPost({ id });

        if (res.status == 200) {
            const data = res.data.data;
            setPost({
                ...data,
                isPublished: !!data.is_published,
                publishedDate: parse(data.published_at, 'yyyy-MM-dd HH:mm:ss', new Date()) ,
            });
        }
    }


    return post == undefined ? <div>Loading</div> : <EditForm post={post} />
}

export const EditForm = ({ post}: { post: Post}) => {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post.title,
            is_published: post.isPublished,
            published_at: post.publishedDate,
            content: post.content,
            tags: post.tags?.reduce((result, item) => {
                if (result == '') {
                    return item.name;
                } else {
                    return `${result},${item.name}`;
                }
            }, ''),
        }
    })

    const doc = useWatch({ name: 'content', control: form.control });

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
        const res = await editPost({
            id: post.id, 
            data: values as PostDataRequest
        });

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

            <div className="grid grid-cols-2 gap-2">
                <div className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                        <FormLabel htmlFor="tags">Tiêu đề</FormLabel>
                                        <FormControl>
                                            <Input id="tags" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                            <div className="mb-4 grid w-full items-center gap-1.5">
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
                            <div className="flex gap-1.5 mb-4">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="grid w-full items-center gap-1.5">
                                            <FormLabel htmlFor="content">Nội dung</FormLabel>
                                            <FormControl>
                                                <Textarea id="content" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-x-2">
                                <Button type="button" variant="ghost" onClick={() => navigate('/')}>Quay lại</Button>
                                <Button type="submit">Cập nhật</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <MarkdownPreview doc={doc} />
            </div>
        </div>
    );
}