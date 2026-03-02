"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  quote: z.string().min(8, "Review text must be at least 8 characters"),
  rating: z.coerce.number().min(1).max(5),
  source: z.string().min(2).default("Google"),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

export default function ReviewForm({ onSuccess, initialData }) {
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
      name: "",
      role: "",
      company: "",
      quote: "",
      rating: 5,
      source: "Google",
      featured: false,
      order: 0,
      isVisible: true,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const url = initialData
        ? `/api/admin/reviews/${initialData.id}`
        : "/api/admin/reviews";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save review");

      const savedItem = await res.json();
      toast.success(initialData ? "Review updated" : "Review created");
      onSuccess(savedItem);
    } catch (_error) {
      toast.error("Error saving review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Client Name</Label>
          <Input
            id="name"
            placeholder="Sarah Al-Mansouri"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Emaar Properties"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" placeholder="Senior Agent" {...register("role")} />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Review Quote</Label>
        <Textarea
          id="quote"
          rows={4}
          placeholder="Share the client review text..."
          {...register("quote")}
        />
        {errors.quote && (
          <p className="text-sm text-destructive">{errors.quote.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            {...register("rating")}
          />
          {errors.rating && (
            <p className="text-sm text-destructive">{errors.rating.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input id="source" placeholder="Google" {...register("source")} />
          {errors.source && (
            <p className="text-sm text-destructive">{errors.source.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" type="number" {...register("order")} />
          {errors.order && (
            <p className="text-sm text-destructive">{errors.order.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 rounded-md border p-4">
        <div className="flex items-center justify-between md:w-1/2">
          <Label htmlFor="featured">Featured Review</Label>
          <Switch
            id="featured"
            checked={watch("featured")}
            onCheckedChange={(checked) => setValue("featured", checked)}
          />
        </div>

        <div className="flex items-center justify-between md:w-1/2">
          <Label htmlFor="isVisible">Visible on Site</Label>
          <Switch
            id="isVisible"
            checked={watch("isVisible")}
            onCheckedChange={(checked) => setValue("isVisible", checked)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Update Review" : "Create Review"}
      </Button>
    </form>
  );
}
