import axios from 'axios';
import type { AnalyzeResponse, Document, DocumentCreate, DocumentUpdate, AnalyticsData } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Text Analysis ──────────────────────────────────────────

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const { data } = await api.post<AnalyzeResponse>('/analyze', { text });
  return data;
}

// ─── Documents ──────────────────────────────────────────────

export async function saveDocument(doc: DocumentCreate): Promise<Document> {
  const { data } = await api.post<Document>('/document', doc);
  return data;
}

export async function getDocument(id: number): Promise<Document> {
  const { data } = await api.get<Document>(`/document/${id}`);
  return data;
}

export async function updateDocument(id: number, doc: DocumentUpdate): Promise<Document> {
  const { data } = await api.put<Document>(`/document/${id}`, doc);
  return data;
}

export async function listDocuments(): Promise<Document[]> {
  const { data } = await api.get<Document[]>('/documents');
  return data;
}

// ─── File Upload ────────────────────────────────────────────

export async function uploadFile(file: File): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<{ text: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ─── Suggestions ────────────────────────────────────────────

export async function acceptSuggestion(id: number): Promise<void> {
  await api.post(`/suggestion/${id}/accept`);
}

export async function ignoreSuggestion(id: number): Promise<void> {
  await api.post(`/suggestion/${id}/ignore`);
}

// ─── Analytics ──────────────────────────────────────────────

export async function getAnalytics(documentId?: number): Promise<AnalyticsData> {
  const url = documentId ? `/analytics/${documentId}` : '/analytics';
  const { data } = await api.get<AnalyticsData>(url);
  return data;
}

export default api;
