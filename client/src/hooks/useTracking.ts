import { History } from 'history';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const trackingId = import.meta.env.VITE_VITE_GA_TRACKING_ID;

declare global {
  interface Window {
    gtag?: (key: string, trackingId: string, config: { page_path: string }) => void;
  }
}

export const useTracking = () => {
  const history: History = useHistory();

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      if (!window.gtag) return;
      if (!trackingId) return;

      window.gtag('config', trackingId, { page_path: location.pathname });
    });

    return unlisten;
  }, [history.listen]);
};
