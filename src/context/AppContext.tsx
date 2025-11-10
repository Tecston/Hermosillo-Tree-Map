import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000/api";
const API_URL = `${API_BASE}/reportes`;

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  location: { lat: number; lng: number };
  imageUrl?: string;
  authorName: string;
  contactPhone: string;
  date: string;
  supports: number;
  comments: Comment[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: [number, number];
  imageUrl?: string;
  institution: string;
  status: "planning" | "in-progress" | "completed";
  startDate: string;
  endDate?: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  points: number;
  isAdmin: boolean;
}

interface AppContextType {
  requests: Request[];
  projects: Project[];
  currentUser: User;
  addRequest: (
    data: Omit<Request, "id" | "date" | "supports" | "comments">
  ) => void;
  addProject: (
    data: Omit<Project, "id" | "likes" | "dislikes" | "comments">
  ) => void;
  supportRequest: (id: string) => void;
  likeProject: (id: string) => void;
  dislikeProject: (id: string) => void;
  addComment: (type: "request" | "project", id: string, text: string) => void;
  deleteRequest: (id: string) => void;
  deleteProject: (id: string) => void;
  fetchRequests: () => void;
}

const initialProjects: Project[] = [];
const initialUser: User = {
  id: "1",
  name: "Usuario Demo",
  points: 50,
  isAdmin: true,
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL);
      const data: Request[] = res.data.map((item: any) => ({
        id: `${item.id}`,
        title: item.title,
        description: item.description,
        category: item.category,
        authorName: item.authorName,
        contactPhone: item.contactPhone ?? "",
        imageUrl: item.imageUrl ?? "",
        date: item.date,
        supports: item.supports ?? 0,
        comments: item.comments ?? [],
        location: { lat: item.location.lat, lng: item.location.lng },
      }));
      setRequests(data);
    } catch {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const addRequest = async (
    data: Omit<Request, "id" | "date" | "supports" | "comments">
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("authorName", data.authorName);
      formData.append("contactPhone", data.contactPhone);
      formData.append("location", JSON.stringify(data.location));
      if (data.imageUrl) {
        const blob = await fetch(data.imageUrl).then((r) => r.blob());
        formData.append(
          "image",
          new File([blob], "image.jpg", { type: blob.type })
        );
      }
      await axios.post(API_URL, formData);
      fetchRequests();
    } catch {}
  };

  const addProject = (
    data: Omit<Project, "id" | "likes" | "dislikes" | "comments">
  ) => {
    setProjects((p) => [
      ...p,
      {
        ...data,
        id: `proj-${Date.now()}`,
        likes: 0,
        dislikes: 0,
        comments: [],
      },
    ]);
  };

  const supportRequest = (id: string) => {
    setRequests((r) =>
      r.map((e) => (e.id === id ? { ...e, supports: e.supports + 1 } : e))
    );
    setCurrentUser((u) => ({ ...u, points: u.points + 2 }));
  };

  const likeProject = (id: string) => {
    setProjects((p) =>
      p.map((e) => (e.id === id ? { ...e, likes: e.likes + 1 } : e))
    );
    setCurrentUser((u) => ({ ...u, points: u.points + 1 }));
  };

  const dislikeProject = (id: string) => {
    setProjects((p) =>
      p.map((e) => (e.id === id ? { ...e, dislikes: e.dislikes + 1 } : e))
    );
  };

  const addComment = (
    type: "request" | "project",
    id: string,
    text: string
  ) => {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: currentUser.name,
      text,
      date: new Date().toISOString().split("T")[0],
    };
    if (type === "request") {
      setRequests((r) =>
        r.map((e) =>
          e.id === id ? { ...e, comments: [...e.comments, comment] } : e
        )
      );
    } else {
      setProjects((p) =>
        p.map((e) =>
          e.id === id ? { ...e, comments: [...e.comments, comment] } : e
        )
      );
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRequests((r) => r.filter((e) => e.id !== id));
    } catch {}
  };

  const deleteProject = (id: string) => {
    setProjects((p) => p.filter((e) => e.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        requests,
        projects,
        currentUser,
        addRequest,
        addProject,
        supportRequest,
        likeProject,
        dislikeProject,
        addComment,
        deleteRequest,
        deleteProject,
        fetchRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
