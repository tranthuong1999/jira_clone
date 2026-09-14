"use client";

import { CreateProjectForm } from "./create-project-form";

import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { ResponsiveModal } from "@/components/responesive-model";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
