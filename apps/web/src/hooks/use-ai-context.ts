import { create } from 'zustand';

export interface AiContextData {
  entityType: 'Lead' | 'Customer' | 'Property' | 'Deal' | 'Appointment' | 'Task' | null;
  entityId: string | null;
  entityName: string | null; // For display purposes (e.g. 'Ahmed Al Mansoori')
}

interface AiContextState extends AiContextData {
  setContext: (data: AiContextData) => void;
  clearContext: () => void;
}

export const useAiContext = create<AiContextState>((set) => ({
  entityType: null,
  entityId: null,
  entityName: null,
  setContext: (data) => set({ ...data }),
  clearContext: () => set({ entityType: null, entityId: null, entityName: null }),
}));
