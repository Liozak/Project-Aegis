
import React from 'react';
import { Shield, AlertTriangle, FileSearch, BarChart3, Settings, ShieldAlert, Activity } from 'lucide-react';

export const APP_NAME = "Project Aegis";
export const APP_VERSION = "1.0.6-stable";

export const MAX_FILE_SIZE_MB = 100;
export const VIDEO_FRAME_COUNT = 8;

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, path: '/' },
  { id: 'detect', label: 'Detection Console', icon: <FileSearch className="w-5 h-5" />, path: '/detect' },
  { id: 'incidents', label: 'Incident History', icon: <ShieldAlert className="w-5 h-5" />, path: '/incidents' },
  { id: 'analytics', label: 'Live Analytics', icon: <Activity className="w-5 h-5" />, path: '/analytics' },
  { id: 'settings', label: 'System Config', icon: <Settings className="w-5 h-5" />, path: '/settings' },
];

export const DATASET_SPECS = [
  { 
    name: 'FaceForensics++', 
    type: 'Video/Image', 
    preprocessing: 'Faces cropped using MTCNN; frames sampled at 30fps.',
    limitation: 'Primarily effective against traditional GAN methods (Deepfakes, FaceSwap).'
  },
  { 
    name: 'Celeb-DF (v2)', 
    type: 'Video', 
    preprocessing: 'High-quality face-alignment; temporal smoothing applied.',
    limitation: 'Requires high-resolution input for 95%+ accuracy.'
  },
  { 
    name: 'ASVspoof 2021', 
    type: 'Audio', 
    preprocessing: 'Constant Q Transform (CQT) and MFCC extraction.',
    limitation: 'Model sensitivity varies with ambient background noise levels.'
  },
];
