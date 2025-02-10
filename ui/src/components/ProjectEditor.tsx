// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { connect, JSONCodec, NatsConnection, Subscription } from "nats.ws";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import Box from "@mui/joy/Box";

import ProjectHeader from "./ProjectHeader";
import ProjectFileHierarchy from "./ProjectFileHierarchy";
import CodeEditor from "./CodeEditor";

import { fetchProjectStructure, startCollaboration, Project, Directory } from "./api";

interface Props {
  project: Project;
}

export default function ProjectEditor({ project }: Props) {
  const [structure, setStructure] = useState<Directory | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string; content: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [collaborationId, setCollaborationId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [natsConnection, setNatsConnection] = useState<NatsConnection | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const isConnected = useRef<boolean>(false);
  const jc = JSONCodec();

  useEffect(() => {
    if (isConnected.current) return;
    isConnected.current = true;

    async function initializeEditor() {
      try {
        setLoading(true);

        const { id } = await startCollaboration(project.id, "user1");
        setCollaborationId(id);

        const structureData = await fetchProjectStructure(`${project.id}`);
        setStructure(structureData);

        const nc = await connect({ servers: "ws://localhost:4223", name: "user1" });
        setNatsConnection(nc);

        const sub = nc.subscribe(`editor.v1.collaboration.${id}.users`);
        setSubscription(sub);

        (async () => {
          for await (const msg of sub) {
            const receivedMessage = jc.decode(msg.data);
            console.log("received message:", receivedMessage);
            handleIncomingMessage(receivedMessage);
          }
        })();

      } catch (error) {
        console.error("error initializing editor:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeEditor();

    return () => {
      console.log("closing NATS connection");
      if (subscription) subscription.unsubscribe();
      if (natsConnection) natsConnection.close();
      isConnected.current = false;
    };
  }, [project.id]);

  useEffect(() => {
    console.log("loading:", loading);
  }, [loading]);

  function handleIncomingMessage(message: any) {
    switch (message.messageType) {
      case "fileCreated":
      case "directoryCreated":
      case "fileDeleted":
      case "directoryDeleted":
        fetchProjectStructure(`${project.id}`).then(setStructure);
        break;
      case "fileUpdated":
        if (selectedFile?.name === message.data.fileName) {
          setSelectedFile({ id: message.data.fileId, name: message.data.fileName, content: message.data.newContent });
        }
        break;
      case "userJoined":
        setOnlineUsers((prev) => prev + 1);
        break;
      case "userLeft":
        setOnlineUsers((prev) => Math.max(0, prev - 1));
        break;
      default:
        console.warn("Unknown message type:", message);
    }
  }

  return (
    <Sheet sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ProjectHeader project={project} onlineUsers={onlineUsers} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Allotment>
          <Allotment.Pane minSize={250} preferredSize="25%">
            <ProjectFileHierarchy
              structure={structure}
              onFileSelect={setSelectedFile}
              projectId={project.id}
              collaborationId={collaborationId}
              natsConnection={natsConnection}
            />
          </Allotment.Pane>
          <Allotment.Pane>
            <CodeEditor
              file={selectedFile}
              projectId={project.id}
              collaborationId={collaborationId}
              natsConnection={natsConnection}
            />
          </Allotment.Pane>
        </Allotment>
      )}
    </Sheet>
  );
}
