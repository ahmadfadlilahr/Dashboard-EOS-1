export type TabType = 
  | 'ai-copilot'
  | 'ticket-generator'
  | 'ip-master'
  | 'network-tools'
  | 'telkom-products'
  | 'hardware-matrix'
  | 'troubleshooting'
  | 'mikrotik-cheatsheet';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    mimeType: string;
  }[];
  modelUsed?: string;
}

export interface ApiSettings {
  geminiKey: string;
  geminiModel: string;
  groqKey: string;
  groqModel: string;
  activeProvider: 'gemini' | 'groq';
}

export interface TicketData {
  ticketNumber: string;
  serviceId: string;
  customerName: string;
  productType: string;
  bandwidth: string;
  segmentGangguan: string;
  waktuDown: string;
  waktuUp?: string;
  picCustomer: string;
  kontakPic: string;
  lokasiAlamat: string;
  gejalaGangguan: string;
  rootCause: string;
  actionTaken: string;
  status: 'OPEN' | 'PROGRESS' | 'MONITORING' | 'RESOLVED' | 'PENDING_VENDOR';
  petugasEOS: string;
  witel: string;
}

export interface TelkomProduct {
  id: string;
  name: string;
  category: 'Internet' | 'VPN / Data' | 'Voice' | 'Wifi Managed' | 'Cloud & SD-WAN';
  description: string;
  sla: string;
  mttr: string;
  ipAllocation: string;
  topology: string;
  keyFeatures: string[];
  configNotes: string[];
  mrtgUrlExample?: string;
  badgeColor: string;
}

export interface HardwareInfo {
  id: string;
  category: 'ONT/Modem' | 'Router CPE' | 'Access Point / WMS' | 'Optical & Fisik';
  brand: string;
  model: string;
  specs: string;
  defaultIp: string;
  defaultLogin: string;
  keyFunctions: string[];
  stepByStepConfig: {
    title: string;
    steps: string[];
  }[];
  opticReadingGuide?: string;
  indicatorsGuide?: {
    led: string;
    status: string;
    meaning: string;
    action: string;
  }[];
}

export interface TroubleshootingStep {
  id: string;
  title: string;
  category: 'Total Down / LOS' | 'Flapping / Intermittent' | 'High Latency / Drop' | 'WMS & AP' | 'SIP Trunk';
  severity: 'Critical' | 'Major' | 'Minor';
  summary: string;
  initialCheck: string[];
  diagnosticFlow: {
    phase: string;
    action: string;
    commandOrTool?: string;
    expectedResult: string;
    ifFailed: string;
  }[];
  escalationMatrix: string;
}

export interface IpConfigSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: {
    subtitle: string;
    points: string[];
    codeBlock?: string;
    badge?: string;
  }[];
}
