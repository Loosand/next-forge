import { cn } from '@repo/design-system/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import {GeistPixelSquare} from "geist/font/pixel"

export const fonts = cn(
  GeistSans.variable,
  GeistMono.variable,
  GeistPixelSquare.variable,
  'touch-manipulation font-sans antialiased'
);
