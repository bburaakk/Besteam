import { apiClient } from './client';

export interface HackathonUserRef {
  id: number;
  username: string;
}

export interface HackathonMember {
  user: HackathonUserRef;
}

export interface HackathonTeam {
  id: number;
  name: string;
  members: HackathonMember[];
}

export interface HackathonItem {
  id: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  url?: string;
  teams?: HackathonTeam[];
}

export const hackathonsService = {
  getAll: async (): Promise<HackathonItem[]> => {
    const res = await apiClient.get<HackathonItem[]>('/hackathons/');
    return res.data;
  },
  joinTeam: async (teamId: number): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/join/`);
  },
  createTeam: async (hackathonId: number, name: string): Promise<HackathonTeam> => {
    const res = await apiClient.post<HackathonTeam>(`/hackathons/${hackathonId}/teams/`, { name });
    return res.data;
  },
};


