declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, SVGProps } from 'react';

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    style?: {
      default?: object;
      hover?: object;
      pressed?: object;
    };
    onClick?: (event: any) => void;
    key?: string;
  }

  export const ComposableMap: ComponentType<{
    projection?: string;
    projectionConfig?: object;
    style?: object;
    children?: ReactNode;
  }>;

  export const Geographies: ComponentType<{
    geography: string;
    children: (data: { geographies: any[] }) => ReactNode;
  }>;

  export const Geography: ComponentType<GeographyProps>;

  export const ZoomableGroup: ComponentType<{
    zoom?: number;
    maxZoom?: number;
    center?: [number, number];
    children?: ReactNode;
  }>;
}
