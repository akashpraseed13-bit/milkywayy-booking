"use client";

import { Edit2, Eye, EyeOff, Plus, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReviewForm from "./ReviewForm";

export default function ReviewList({ initialItems }) {
  const [items, setItems] = useState(initialItems || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.featured === b.featured) {
          if ((a.order || 0) === (b.order || 0)) {
            return b.id - a.id;
          }
          return (a.order || 0) - (b.order || 0);
        }
        return a.featured ? -1 : 1;
      }),
    [items],
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setItems(items.filter((i) => i.id !== id));
      toast.success("Review deleted successfully");
    } catch (_error) {
      toast.error("Error deleting review");
    }
  };

  const toggleVisibility = async (item) => {
    try {
      const res = await fetch(`/api/admin/reviews/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !item.isVisible }),
      });

      if (!res.ok) throw new Error("Failed to update visibility");

      const updatedItem = await res.json();
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
      toast.success(`Review ${updatedItem.isVisible ? "published" : "hidden"}`);
    } catch (_error) {
      toast.error("Error updating visibility");
    }
  };

  const toggleFeatured = async (item) => {
    try {
      const res = await fetch(`/api/admin/reviews/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !item.featured }),
      });

      if (!res.ok) throw new Error("Failed to update featured status");

      const updatedItem = await res.json();
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
      toast.success(
        updatedItem.featured ? "Marked as featured" : "Removed from featured",
      );
    } catch (_error) {
      toast.error("Error updating featured status");
    }
  };

  const handleFormSuccess = (savedItem) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === savedItem.id ? savedItem : i)));
    } else {
      setItems([...items, savedItem]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" /> New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Review" : "Create New Review"}
              </DialogTitle>
            </DialogHeader>
            <ReviewForm
              onSuccess={handleFormSuccess}
              initialData={editingItem}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.role} at {item.company}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Number(item.rating) || 0 }).map(
                        (_, index) => (
                          <Star
                            key={`${item.id}_${index}`}
                            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                          />
                        ),
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isVisible ? "default" : "secondary"}>
                      {item.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.featured ? "default" : "outline"}>
                      {item.featured ? "Featured" : "Standard"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(item)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeatured(item)}
                        title={item.featured ? "Unfeature" : "Feature"}
                      >
                        <Star
                          size={18}
                          className={
                            item.featured
                              ? "fill-yellow-400 text-yellow-400"
                              : ""
                          }
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(item)}
                        title={item.isVisible ? "Hide" : "Show"}
                      >
                        {item.isVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
