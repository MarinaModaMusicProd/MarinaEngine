import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Track} from '@app/web-player/tracks/track';
import {Lyric} from '@app/web-player/tracks/lyrics/lyric';

interface Response extends BackendResponse {
  lyric?: Lyric;
}

export function useLyrics(track: Track) {
  return useQuery({
    queryKey: ['lyrics', track.id],
    queryFn: () => fetchLyrics(track.id),
  });
}

function fetchLyrics(trackId: number) {
  return apiClient
    .get<Response>(`tracks/${trackId}/lyrics`)
    .then(response => response.data);
}
