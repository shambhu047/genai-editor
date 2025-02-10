// @ts-nocheck
import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { JSONCodec, NatsConnection } from "nats.ws";

interface Props {
  file: { id: string; name: string; content: string } | null;
  projectId: string;
  collaborationId: string | null;
  natsConnection: NatsConnection | null;
}

export default function CodeEditor({ file, projectId, collaborationId, natsConnection }: Props) {
  const [content, setContent] = useState(file?.content || "");

  useEffect(() => {
    setContent(file?.content || "");
  }, [file]);

  const saveFile = async () => {
    if (!file || !collaborationId || !natsConnection) return;

    const message = {
      messageType: "fileUpdated",
      collaborationId,
      timestamp: new Date().toISOString(),
      data: JSON.stringify({
        fileId: file.id,
        fileName: file.name,
        newContent: content,
      }),
    };

    const jc = JSONCodec();
    await natsConnection.publish("editor.v1.collaboration.hub", jc.encode(message));
    console.log("published file update:", message);
  };

  return (
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column", height: "100%" }}>
      {file ? (
        <>
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", height: "100%", padding: "10px", fontSize: "14px", fontFamily: "monospace" }}
          />
          <Button onClick={saveFile} sx={{ marginTop: 2 }}>Save</Button>
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <p>Select a file to edit</p>
        </Box>
      )}
    </Box>
  );
}
