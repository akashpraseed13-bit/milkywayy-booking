"use client";

import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PortfolioList({ initialItems }) {
  const [items, setItems] = useState(initialItems);

  const toggleVisibility = async (item) => {
    try {
      const res = await fetch(`/api/admin/our-works/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !item.isVisible }),
      });

      if (!res.ok) throw new Error("Failed to update visibility");

      const updatedItem = await res.json();
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
      toast.success(`Entry ${updatedItem.isVisible ? "published" : "hidden"}`);
    } catch (_error) {
      toast.error("Error updating visibility");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/admin/our-works/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      setItems(items.filter((i) => i.id !== id));
      toast.success("Entry deleted successfully");
    } catch (_error) {
      toast.error("Error deleting entry");
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No portfolio items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <GripVertical
                    className="text-muted-foreground cursor-move"
                    size={20}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.isVisible ? "default" : "secondary"}>
                    {item.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
  );
}
