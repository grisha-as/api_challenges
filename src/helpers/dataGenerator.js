import { v4 as uuidv4 } from 'uuid';

export function generationGuid() {
    return uuidv4();
}

export function generationProgress(data, guid) {
  data.xChallenger = guid;
  return data;
};