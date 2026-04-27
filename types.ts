
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ClassificationType {
  GENUINE = 'genuine',
  DEEPFAKE = 'deepfake',
  AI_GENERATED = 'ai_generated',
  HYBRID = 'hybrid'
}

export interface ForensicSignal {
  name: string;
  description: string;
  detected: boolean;
  score: number; // 0-1
  engine: 'deepfake' | 'synthetic' | 'provenance' | 'consistency' | 'semantic'; // Added semantic engine
}

export interface MediaPart {
  data: string; // Base64
  mimeType: string;
}

export interface DetectionIncident {
  id: string;
  timestamp: string;
  mediaType: MediaType;
  fileName: string;
  confidenceScore: number; // 0-100
  classification: ClassificationType;
  isDeepfake: boolean; 
  severity: Severity;
  processingTimeMs: number;
  provenance_score: number; // Added top-level provenance score
  semantic_authenticity: number; // Added top-level semantic authenticity
  provenance: {
    physical_capture_likelihood: number; // 0-1
    synthetic_generation_likelihood: number; // 0-1
    capture_chain_consistency: number; // 0-1
    semantic_authenticity: number; // 0-1 New SAE metric
  };
  forensics: {
    explanation: string;
    signals: ForensicSignal[];
    metadata?: {
      synthetic_probability: number;
      impersonation_probability: number;
      engine_source: string;
      consistency_failures?: string[];
      semantic_priors_detected?: string[];
    };
  };
  filePreview?: string;
}

export interface DashboardStats {
  totalDetections: number;
  deepfakeCount: number;
  aiGeneratedCount: number;
  hybridCount: number;
  genuineCount: number;
  avgConfidence: number;
}

export interface SystemSettings {
  escalationThreshold: number;
  inferenceEngine: string;
}
