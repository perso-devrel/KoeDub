import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const APP_NAME = 'AniVoice';

export function usePageTitle(titleKey: string) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const translated = t(titleKey);
    document.title = translated ? `${translated} | ${APP_NAME}` : APP_NAME;
    return () => { document.title = APP_NAME; };
  }, [t, titleKey, i18n.language]);
}
