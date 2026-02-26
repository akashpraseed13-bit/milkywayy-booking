"use client";

import { useRef, useState } from "react";
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
import { createUser } from "@/lib/actions/users";

const roles = [
  { key: "SUPERADMIN", label: "Super Admin" },
  { key: "TRANSPORT", label: "Transport" },
  { key: "SHOOT", label: "Shoot" },
];

export default function CreateUserForm({ onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef(null);

  const scrollToError = () => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.target);
    const userData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      // Scroll to error after a short delay to ensure it's rendered
      setTimeout(scrollToError, 100);
      return;
    }

    try {
      const res = await createUser(userData);

      if (res.success) {
        onSubmit(res.data);
      } else {
        setError(res.message);
        setTimeout(scrollToError, 100);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setTimeout(scrollToError, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      {error && (
        <div 
          ref={errorRef}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded sticky top-0 z-10"
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="Enter phone number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select name="role" required>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.key} value={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </div>
    </form>
  );
}
