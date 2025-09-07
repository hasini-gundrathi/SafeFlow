
export interface BoundingBox {
  x: number; // top-left x, normalized (0-1)
  y: number; // top-left y, normalized (0-1)
  width: number;
  height: number;
}

export interface HeatmapPoint {
    x: number; // normalized (0-1)
    y: number; // normalized (0-1)
    intensity: number; // 0-1
}

export interface CrowdMetrics {
    density: number; // 0-1
    pressure: number; // 0-1
    velocityVariance: number; // 0-1
    flowVariance: number; // 0-1
    velocitySpikes: number; // count
}

export interface AnalysisResult {
  people: { box: BoundingBox }[];
  metrics: CrowdMetrics;
  heatmap: HeatmapPoint[];
  riskLevel: 'SAFE' | 'RISK' | 'STAMPEDE';
}
