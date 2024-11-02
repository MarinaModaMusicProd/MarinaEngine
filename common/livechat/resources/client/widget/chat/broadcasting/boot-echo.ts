import EchoType from 'laravel-echo';
import {setEchoSocketId} from '@common/http/get-echo-socket-id';
import {getBootstrapData} from '@ui/bootstrap-data/bootstrap-data-store';

let globalEcho: Promise<EchoType> | null = null;

export async function bootEcho() {
  // deduplicate requests from different components
  if (globalEcho) {
    return await globalEcho;
  }

  globalEcho = new Promise(async (resolve, reject) => {
    const [{default: Echo}] = await Promise.all([
      import('laravel-echo'),
      import('pusher-js'),
    ]);

    const echoInstance = new Echo(getCredentials());

    echoInstance.connector.pusher.connection.bind(
      'connected',
      function (e: any) {
        setEchoSocketId(e.socket_id);
        resolve(echoInstance);
      },
    );
  });
  return globalEcho;
}

interface EchoCredentials {
  broadcaster: string;
  key?: string;
  cluster?: string;
  forceTLS?: boolean;
  wsHost?: string;
  wsPort?: number;
  wssPort?: number;
  disableStats?: boolean;
  encrypted?: boolean;
  enabledTransports?: string[];
}

function getCredentials(): EchoCredentials {
  const config = getBootstrapData().settings.broadcasting;
  switch (config?.driver) {
    case 'pusher':
      return {
        broadcaster: 'pusher',
        key: config.key,
        cluster: config.cluster,
        forceTLS: true,
      };
    case 'reverb':
      return {
        broadcaster: 'reverb',
        key: config.key,
        wsHost: config.host,
        wsPort: config.port,
        wssPort: config.port,
        forceTLS: (config.scheme ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
      };
    case 'ably':
      return {
        broadcaster: 'pusher',
        key: config.key,
        cluster: 'any',
        wsHost: 'realtime-pusher.ably.io',
        wsPort: 443,
        disableStats: true,
        encrypted: true,
      };
    default:
      return {
        broadcaster: 'pusher',
      };
  }
}
