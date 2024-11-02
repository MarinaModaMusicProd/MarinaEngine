import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {
  content: string;
}

export enum ModifyTextWithAiInstruction {
  Simplify = 'simplify',
  Shorten = 'shorten',
  Lengthen = 'lengthen',
  FixSpelling = 'fixSpelling',
  Translate = 'translate',
  ChangeTone = 'changeTone',
}

export enum ModifyTextWithAiTone {
  casual = 'casual',
  formal = 'formal',
  confident = 'confident',
  friendly = 'friendly',
  inspirational = 'inspirational',
  motivational = 'motivational',
  nostalgic = 'nostalgic',
  professional = 'professional',
  playful = 'playful',
  scientific = 'scientific',
  witty = 'witty',
  straightforward = 'straightforward',
}

export interface ModifyTextWithAiPayload {
  instruction: ModifyTextWithAiInstruction;
  text: string;
  tone?: ModifyTextWithAiTone;
  language?: string;
}

export function useModifyTextWithAi(
  form?: UseFormReturn<ModifyTextWithAiPayload>,
) {
  return useMutation({
    mutationKey: ['modifyTextWithAi'],
    mutationFn: (payload: ModifyTextWithAiPayload) => modifyText(payload),
    onError: err =>
      form ? onFormQueryError(err, form) : showHttpErrorToast(err),
  });
}

async function modifyText(payload: ModifyTextWithAiPayload) {
  return apiClient.post<Response>('ai/modify-text', payload).then(r => r.data);
}
