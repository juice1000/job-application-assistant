import axios from 'axios';
import { formatData } from './formatData';

const API_URL = 'http://localhost:8000';

export interface Job {
  id: number;
  title: string;
  url: string;
  keywords: string;
  description: string;
  status: 'pending' | 'applied' | 'rejected' | 'irrelevant' | 'review' | 'ready';
  dateApplied: string;
  applicationLetter: string;
  language: string;
  contactPerson: string;
}

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}/jobs/`);
    return formatData(response.data);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return [];
  }
};
export const scrapeJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/scrape`);
    return formatData(response.data);
  } catch (error) {
    console.error('Error scraping jobs:', error);
  }
};

export const updateJobStatus = async (jobId: number, status: Job['status']) => {
  try {
    const response = await axios.put(`${API_URL}/jobs/${jobId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
  }
};
export const updateApplication = async (jobId: number, applicationLetter?: Job['applicationLetter']) => {
  try {
    const response = await axios.put(`${API_URL}/jobs/${jobId}`, { applicationLetter });
    return response.data;
  } catch (error) {
    console.error('Error updating application letter:', error);
  }
};
export const writeApplication = async (jobId: number) => {
  try {
    await axios.get(`${API_URL}/write_applications/${jobId}`);
  } catch (error) {
    console.error('Error writing application:', error);
  }
};
export const writeCoverLetter = async (update?: boolean) => {
  try {
    if (update !== undefined) {
      await axios.get(`${API_URL}/write_applications`, { params: { update: update } });
    } else {
      await axios.get(`${API_URL}/write_applications`);
    }
  } catch (error) {
    console.error('Error writing cover letters:', error);
  }
};
export const applyToJobs = async () => {
  try {
    await axios.get(`${API_URL}/apply`);
  } catch (error) {
    console.error('Error applying to jobs:', error);
  }
};
