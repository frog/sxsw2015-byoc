export interface Player {
  id?: string;
  socketId?: string;
  number?: number;
  errors?: number;
  sequenceIndex?: number;
  isSequenceCompleted?: boolean;
  lastSequenceDuration?: number;
  isConnected?: boolean;
  userAgent?: string; 
}