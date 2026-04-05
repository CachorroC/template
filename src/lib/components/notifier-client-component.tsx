'use client';

import useNotification from '#@/app/hooks/useNotification';

export default function NotifierClientComponent({
  titulo,
  contenido,
  tag,
}: {
  titulo: string;
  tag?: string;
  contenido?: string;
}) {
  const { notify, close } = useNotification(titulo, {
    onClick: (ev) => {
      alert(JSON.stringify(ev));
    },

    body: contenido,
    requireInteraction: true,
    dir: 'ltr',
    lang: 'es',
    tag: tag,
    onClose: (e) => {
      console.log(e);
    },
  });

  return (
    <div>
      <button onClick={notify}>Show notification</button>
      <button onClick={close}>Close notification</button>
    </div>
  );
}
