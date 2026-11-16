'use client';

export default function CookieSettingsButton({
  className = '',
  children = 'Configuración de cookies',
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new Event('jotaedra:open-cookie-consent'));
      }}
    >
      {children}
    </button>
  );
}
