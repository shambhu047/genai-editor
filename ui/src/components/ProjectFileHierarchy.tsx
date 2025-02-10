// @ts-nocheck
import React, { useState } from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/Add";

import { Directory, File } from "./api";
import { JSONCodec, NatsConnection } from "nats.ws";
import FileDirectoryCreateForm from "./FileDirectoryCreateForm";

interface Props {
  structure: Directory | null;
  onFileSelect: (file: { name: string; content: string }) => void;
  projectId: string;
  collaborationId: string | null;
  natsConnection: NatsConnection | null;
}

export default function ProjectFileHierarchy({ structure, onFileSelect, projectId, collaborationId, natsConnection }: Props) {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<string | null>(null);

  if (!structure) {
    return (
      <Box sx={{ padding: 2, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography level="body2">Loading project structure...</Typography>
      </Box>
    );
  }

  const openCreateModal = (directoryId: string) => {
    setSelectedDirectoryId(directoryId);
    setCreateModalOpen(true);
  };

  const renderStructure = (directory: Directory) => (
    <List key={directory.id} sx={{ paddingLeft: 1 }}>
      <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FolderIcon sx={{ marginRight: 1, color: "primary.main" }} />
          <Typography sx={{ fontWeight: "bold" }}>{directory.name}</Typography>
        </Box>
        <IconButton onClick={() => openCreateModal(directory.id)}>
          <AddIcon />
        </IconButton>
      </ListItem>

      {directory.files?.map((file: File) => (
        <ListItemButton key={file.id} onClick={() => onFileSelect({ name: file.name, content: file.content })}>
          <InsertDriveFileIcon sx={{ marginRight: 1, color: "secondary.main" }} />
          {file.name}
        </ListItemButton>
      ))}

      {directory.subdirectories?.map((subdir: Directory) => renderStructure(subdir))}
    </List>
  );

  return (
    <Box sx={{ padding: 2, overflowY: "auto", height: "100%" }}>
      {structure ? renderStructure(structure) : <Typography>No files found</Typography>}

      <FileDirectoryCreateForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        parentDirectoryId={selectedDirectoryId || ""}
        collaborationId={collaborationId}
        natsConnection={natsConnection}
      />
    </Box>
  );
}
