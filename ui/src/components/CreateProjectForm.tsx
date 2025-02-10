// @ts-nocheck
import * as React from "react";
import { useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { createProject } from "./api"; // Import API function

interface CreateProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProjectForm({ open, onClose, onSuccess }: CreateProjectFormProps) {
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createProject(projectName);
      onSuccess();
      onClose();
      setProjectName("");
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Typography level="h4">Create New Project</Typography>
        <Typography level="body2" sx={{ mt: 1 }}>
          Enter the name of the new project:
        </Typography>
        <Input
          autoFocus
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          sx={{ mt: 2 }}
        />
        {error && <Typography color="danger" sx={{ mt: 1 }}>{error}</Typography>}
        <Button onClick={handleCreate} loading={loading} sx={{ mt: 2, width: "100%" }}>
          Create
        </Button>
      </ModalDialog>
    </Modal>
  );
}
