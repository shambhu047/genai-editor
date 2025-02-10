// @ts-nocheck

const baseUrl = 'http://localhost:8000'
// const baseUrl = ''

export interface Project {
  id: number;
  name: string;
  root_directory_id?: number | null;
}

export interface Directory {
  id: number;
  name: string;
  parentDirectoryId?: number | null;
  subdirectories: Directory[];
  files: File[];
}

export interface File {
  id: number;
  name: string;
  content?: string | null;
  directoryId?: number | null;
}

export async function fetchProjectList(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${baseUrl}/v1/projects`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch projects: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []
  }
}

export async function createProject(name: string): Promise<void> {
  const response = await fetch(`${baseUrl}/v1/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status} ${response.statusText}`);
  }
}

export async function fetchProjectDetails(projectId: string) {
  const response = await fetch(`${baseUrl}/v1/projects/${projectId}`);
  if (!response.ok) throw new Error("Failed to fetch project details");
  return await response.json();
}

export async function fetchProjectStructure(projectId: string) {
  const response = await fetch(`${baseUrl}/v1/projects/${projectId}/structure`);
  if (!response.ok) throw new Error("Failed to fetch project structure");
  return await response.json();
}

export async function startCollaboration(projectId: string, userId: string): Promise<{ id: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/projects/${projectId}/collaborate?userId=${userId}`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to start collaboration");
    return await response.json();
  } catch (error) {
    console.error("Error starting collaboration:", error);
    throw error;
  }
}
