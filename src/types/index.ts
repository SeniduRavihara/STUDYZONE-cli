import React from "react";

export type DataContextType = {
  currentUserData: UserDataType | null;
  setCurrentUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
};

export type AuthContextType = {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export type CurrentUser = {
  email: string;
  name: string;
  dateOfBirth: Date;
  createdAt: Date;
  isAdmin: boolean;
};

export type UserDataType = {
  name: string;
  email: string;
};

export type PastPaper = {
  id: string;
  name: string;
  url: string;
  uploadDate: Date;
  size: string;
};

export type VideoLink = {
  title: string;
  url: string;
  thumbnailUrl: string;
  addedOn: any;
  videoId: string;
};

export type Quiz = {
  id: string;
  title: string;
  url: string;
  uploadDate: any;
  questions: number;
  size: string;
  fileName: string,
};

export interface Course {
  id: string;
  code: string;
  title: string;
  students?: number;
  materials?: number;
  image?: string;
  academicYear: string;
  semester: string;
  pastPapers?: PastPaper[];
  videos?: VideoLink[];
  quizzes?: Quiz[];
}
