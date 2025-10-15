import { PropertiesPage } from '../presentation/pages/PropertiesPage';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/demo');
  return <PropertiesPage />;
}
