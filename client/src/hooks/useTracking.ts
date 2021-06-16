import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const trackingId = 'G-D694YQTG4R';

declare global {
  interface Window {
    gtag?: (key: string, trackingId: string, config: { page_path: string }) => void;
  }
}

export const useTracking = () => {
  const { listen } = useHistory();

  useEffect(() => {
    const unlisten = listen((location) => {
      if (!window.gtag) return;
      if (!trackingId) return;

      window.gtag('config', trackingId, { page_path: location.pathname });
    });

    return unlisten;
  }, [listen]);
};
