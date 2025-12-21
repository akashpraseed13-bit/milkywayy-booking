"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OUR_WORK_TYPES } from "@/lib/config/app.config";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().optional(),
  type: z.enum(Object.values(OUR_WORK_TYPES)),
  mediaContent: z.string().min(1, "Media content is required"),
  order: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

export default function PortfolioForm({ onSuccess, initialData }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      type: OUR_WORK_TYPES.IMAGE,
      mediaContent: "",
      order: 0,
      isVisible: true,
    },
  });

  const watchType = form.watch("type");

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      form.setValue("mediaContent", url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/admin/our-works/${initialData.id}`
        : "/api/admin/our-works";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save");

      const savedItem = await res.json();
      toast.success(initialData ? "Entry updated" : "Entry created");
      onSuccess(savedItem);
    } catch (error) {
      toast.error("Error saving entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Location or Category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(OUR_WORK_TYPES).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mediaContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {watchType === OUR_WORK_TYPES.IMAGE ? "Image URL" : "Media URL"}
              </FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder={
                      watchType === OUR_WORK_TYPES.IMAGE
                        ? "S3 URL or Upload"
                        : "YouTube / Instagram / Panoee Link"
                    }
                    {...field}
                  />
                </FormControl>
                {watchType === OUR_WORK_TYPES.IMAGE && (
                  <div className="relative">
                    <Input
                      type="file"
                      className="hidden"
                      id="portfolio-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      asChild
                      disabled={isUploading}
                    >
                      <label htmlFor="portfolio-upload" className="cursor-pointer">
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </label>
                    </Button>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Entry" : "Create Entry"}
        </Button>
      </form>
    </Form>
  );
}
