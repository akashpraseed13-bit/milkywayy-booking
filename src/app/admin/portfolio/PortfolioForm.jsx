"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OUR_WORK_TYPES } from "@/lib/config/app.config";

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
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

  const watchType = watch("type");

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
      setValue("mediaContent", url);
      toast.success("Image uploaded successfully");
    } catch (_error) {
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
    } catch (_error) {
      toast.error("Error saving entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Project Title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          placeholder="Location or Category"
          {...register("subtitle")}
        />
        {errors.subtitle && (
          <p className="text-sm text-destructive">{errors.subtitle.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Media Type</Label>
        <Select
          onValueChange={(val) => setValue("type", val)}
          defaultValue={watchType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(OUR_WORK_TYPES).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaContent">
          {watchType === OUR_WORK_TYPES.IMAGE ? "Image URL" : "Media URL"}
        </Label>
        <div className="flex gap-2">
          <Input
            id="mediaContent"
            placeholder={
              watchType === OUR_WORK_TYPES.IMAGE
                ? "S3 URL or Upload"
                : "YouTube / Instagram / Panoee Link"
            }
            {...register("mediaContent")}
          />
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
        {errors.mediaContent && (
          <p className="text-sm text-destructive">
            {errors.mediaContent.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input id="order" type="number" {...register("order")} />
        {errors.order && (
          <p className="text-sm text-destructive">{errors.order.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Update Entry" : "Create Entry"}
      </Button>
    </form>
  );
}
