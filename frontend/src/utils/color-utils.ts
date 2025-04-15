/**
 * 색상 관련 유틸리티 함수
 */

/**
 * RGB 색상을 HEX 형식으로 변환합니다.
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
};

/**
 * HEX 색상을 RGB 형식으로 변환합니다.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * RGB 색상을 HSL 형식으로 변환합니다.
 */
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
};

/**
 * HSL 색상을 RGB 형식으로 변환합니다.
 */
export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * 색상 명도를 조절합니다.
 * @param hex HEX 색상 코드
 * @param amount 양수는 밝게, 음수는 어둡게 (범위: -100 ~ 100)
 */
export const adjustBrightness = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const factor = 1 + amount / 100;

  return rgbToHex(
    Math.max(0, Math.min(255, Math.round(r * factor))),
    Math.max(0, Math.min(255, Math.round(g * factor))),
    Math.max(0, Math.min(255, Math.round(b * factor)))
  );
};

/**
 * 색상 대비를 계산합니다. (WCAG 2.0)
 */
export const calculateContrast = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;

    const { r, g, b } = rgb;
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const luminance1 = getLuminance(foreground);
  const luminance2 = getLuminance(background);

  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * 색상이 가독성이 좋은지 확인합니다. (WCAG AA 기준)
 */
export const isReadable = (foreground: string, background: string): boolean => {
  const contrast = calculateContrast(foreground, background);
  return contrast >= 4.5;
};

/**
 * 색상 팔레트를 생성합니다.
 * @param baseColor 기본 색상 (HEX)
 * @param steps 단계 수
 */
export const generateColorPalette = (baseColor: string, steps: number): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette: string[] = [];

  for (let i = 0; i < steps; i++) {
    // 0에 가까울수록 어둡고, 1에 가까울수록 밝게
    const newL = Math.max(0, Math.min(1, l * (1 - 0.5 + i / (steps - 1))));
    const { r, g, b } = hslToRgb(h, s, newL);
    palette.push(rgbToHex(r, g, b));
  }

  return palette;
};

/**
 * 무작위 색상을 생성합니다.
 */
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * 텍스트에 따라 결정적인(deterministic) 색상을 생성합니다.
 * 같은 텍스트는 항상 같은 색상을 반환합니다.
 */
export const generateDeterministicColor = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

/**
 * 색상 보완(complementary) 색상을 반환합니다.
 */
export const getComplementaryColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return rgbToHex(
    255 - rgb.r,
    255 - rgb.g,
    255 - rgb.b
  );
};

/**
 * 색상이 어두운지 밝은지 확인합니다.
 * 밝은 색상에는 어두운 텍스트, 어두운 색상에는 밝은 텍스트를 사용하기 위함입니다.
 */
export const isColorLight = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  
  // YIQ 방정식을 통한 색상 밝기 측정
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq >= 128;
};

/**
 * 색상을 alpha 값과 함께 RGBA 문자열로 변환합니다.
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * 두 색상을 혼합합니다.
 */
export const blendColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const blend = (a: number, b: number) => Math.round(a * (1 - ratio) + b * ratio);
  
  return rgbToHex(
    blend(rgb1.r, rgb2.r),
    blend(rgb1.g, rgb2.g),
    blend(rgb1.b, rgb2.b)
  );
};