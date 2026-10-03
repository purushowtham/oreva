import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'ORÉVA Studio — Spaces. Stories. Desire.',description:'Immersive portfolio prototype for ORÉVA Studio.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
