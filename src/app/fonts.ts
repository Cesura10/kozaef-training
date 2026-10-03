import { Archivo, Geist, Geist_Mono } from 'next/font/google';

// Fuentes compartidas por los dos layouts raíz: (site) y (platform).
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'], axes: ['wdth'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const fontVariables = `${geistSans.variable} ${archivo.variable} ${geistMono.variable}`;
