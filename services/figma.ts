const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FIGMA_ACCESS_TOKEN = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;

interface FigmaFileResponse {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: any;
}

interface FigmaImageResponse {
  images: { [key: string]: string };
}

/**
 * Figma 파일 정보 가져오기
 */
export async function getFigmaFile(fileKey: string): Promise<FigmaFileResponse> {
  try {
    const response = await fetch(`${FIGMA_API_BASE}/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Figma 파일 로드 실패:', error);
    throw error;
  }
}

/**
 * Figma 노드의 이미지 URL 가져오기
 */
export async function getFigmaImages(
  fileKey: string,
  nodeIds: string[],
  scale: number = 2
): Promise<FigmaImageResponse> {
  try {
    const ids = nodeIds.join(',');
    const response = await fetch(
      `${FIGMA_API_BASE}/images/${fileKey}?ids=${ids}&scale=${scale}&format=png`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Figma API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Figma 이미지 로드 실패:', error);
    throw error;
  }
}

/**
 * Figma 파일에서 특정 프레임/컴포넌트 찾기
 */
export function findNodeByName(node: any, name: string): any {
  if (node.name === name) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByName(child, name);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Figma 스타일 정보 추출
 */
export function extractStyles(node: any) {
  return {
    backgroundColor: node.backgroundColor,
    fills: node.fills,
    strokes: node.strokes,
    effects: node.effects,
    cornerRadius: node.cornerRadius,
    fontSize: node.style?.fontSize,
    fontFamily: node.style?.fontFamily,
    fontWeight: node.style?.fontWeight,
    textAlignHorizontal: node.style?.textAlignHorizontal,
    letterSpacing: node.style?.letterSpacing,
    lineHeight: node.style?.lineHeightPx,
  };
}

/**
 * Figma 색상을 CSS 형식으로 변환
 */
export function figmaColorToCSS(color: { r: number; g: number; b: number; a?: number }): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a !== undefined ? color.a : 1;

  if (a === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Figma 파일 키 추출 (URL에서)
 */
export function extractFileKeyFromUrl(url: string): string | null {
  const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export default {
  getFigmaFile,
  getFigmaImages,
  findNodeByName,
  extractStyles,
  figmaColorToCSS,
  extractFileKeyFromUrl,
};
