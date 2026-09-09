import { Analytics } from '@vercel/analytics/react';
import WeddingInvitation from './WeddingInvitation';
import './index.css';

export default function App() {
  return (
    <>
      <WeddingInvitation />
      <Analytics />
    </>
  );
}
