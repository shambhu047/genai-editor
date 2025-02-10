// @ts-nocheck
import React, {useState} from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CircularProgress from "@mui/joy/CircularProgress";
import {JSONCodec, NatsConnection} from "nats.ws";

interface FileDirectoryCreateFormProps {
  open: boolean;
  onClose: () => void;
  parentDirectoryId: string;
  collaborationId: string | null;
  natsConnection: NatsConnection | null;
}

const FileDirectoryCreateForm: React.FC<FileDirectoryCreateFormProps> = (
  {
    open,
    onClose,
    parentDirectoryId,
    collaborationId,
    natsConnection,
  }) => {
  const [type, setType] = useState<string>("file");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!collaborationId || !natsConnection) {
      setError("NATS connection not available");
      return;
    }

    if (!name) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const message = {
        messageType: type === "file" ? "fileCreated" : "directoryCreated",
        collaborationId,
        timestamp: new Date().toISOString(),
        data: JSON.stringify({
          id: crypto.randomUUID(),
          name,
          parentDirectoryId,
          createdBy: "user123",
        }),
      };

      const jc = JSONCodec();
      await natsConnection.publish("editor.v1.collaboration.hub", jc.encode(message));
      console.log(`Published ${type} creation:`, message);
      onClose();
    } catch (err) {
      console.error("Error publishing message:", err);
      setError("Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose/>
        <Typography level="h5">Create {type === "file" ? "File" : "Directory"}</Typography>
        <Box sx={{mt: 2, display: "flex", flexDirection: "column", gap: 2, width: "400px"}}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select value={type} onChange={(e, value) => setType(value as string)}>
              <Option value="file">File</Option>
              {/*<Option value="directory">Directory</Option>*/}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"/>
          </FormControl>

          {error && (
            <Typography color="danger" sx={{mt: 1}}>
              {error}
            </Typography>
          )}

          <Button onClick={handleCreate} color="primary" disabled={loading || !name}>
            {loading ? <CircularProgress size="sm"/> : `Create ${type === "file" ? "File" : "Directory"}`}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default FileDirectoryCreateForm;
