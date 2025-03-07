import { DisposableLike } from 'tsjam';

type LoadScriptParams = Readonly<{
  src: string;
  id?: string;
}>;

export const loadScript = (params: LoadScriptParams): Promise<DisposableLike> => {
  const { src, id = Math.random().toString(16) } = params;
  const script = document.createElement('script');

  script.src = src;
  script.id = id;
  script.async = true;
  script.type = 'text/javascript';

  document.body.appendChild(script);

  return new Promise((resolve, reject) => {
    // loadScript result to be used to remove script on dispose
    script.onload = (): void => resolve({ dispose: () => document.body.removeChild(script) });
    script.onerror = (err): void => {
      document.body.removeChild(script);
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      reject(err);
    };
  });
};
