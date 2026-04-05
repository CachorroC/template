import { headers } from 'next/headers';
import style from 'styles/card.module.css';

export default async function NotFound() {
  const headersList = await headers();

  const domain = headersList.get('host');

  return (
    <div className={style.card}>
      <h2>Not Found {domain}</h2>
      <p>Could not find requested resource</p>
      <pre> {JSON.stringify(headersList, null, 2)}</pre>
    </div>
  );
}
