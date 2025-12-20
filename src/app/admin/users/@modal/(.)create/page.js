"use client";

import { useRouter } from "next/navigation";
import CreateUserForm from "@/components/CreateUserForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateUserModal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (userData) => {
    // TODO: Implement user creation logic
    console.log("Creating user:", userData);
    handleClose();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CreateUserForm onSubmit={handleSubmit} onCancel={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
