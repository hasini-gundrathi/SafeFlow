
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { GEMINI_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    people: {
      type: Type.ARRAY,
      description: "Array of all detected people in the frame.",
      items: {
        type: Type.OBJECT,
        properties: {
          box: {
            type: Type.OBJECT,
            description: "Normalized bounding box [x, y, width, height].",
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
            },
            required: ['x', 'y', 'width', 'height']
          }
        },
        required: ['box']
      }
    },
    metrics: {
        type: Type.OBJECT,
        description: "Computed crowd dynamic features.",
        properties: {
            density: { type: Type.NUMBER, description: "Crowd density from 0 (empty) to 1 (packed)." },
            pressure: { type: Type.NUMBER, description: "Crowd pressure from 0 (no pressure) to 1 (crushing)." },
            velocityVariance: { type: Type.NUMBER, description: "Variance in movement speed (0=uniform, 1=chaotic)." },
            flowVariance: { type: Type.NUMBER, description: "Variance in movement direction (0=uniform, 1=chaotic)." },
            velocitySpikes: { type: Type.INTEGER, description: "Count of sudden surges or velocity spikes." },
        },
        required: ['density', 'pressure', 'velocityVariance', 'flowVariance', 'velocitySpikes']
    },
    heatmap: {
        type: Type.ARRAY,
        description: "Array of points representing crowd density for a heatmap visualization.",
        items: {
            type: Type.OBJECT,
            properties: {
                x: { type: Type.NUMBER, description: "Normalized x coordinate." },
                y: { type: Type.NUMBER, description: "Normalized y coordinate." },
                intensity: { type: Type.NUMBER, description: "Intensity of the point from 0 to 1." },
            },
            required: ['x', 'y', 'intensity']
        }
    },
    riskLevel: {
      type: Type.STRING,
      enum: ['SAFE', 'RISK', 'STAMPEDE'],
      description: "Final classification of the stampede risk level by the 'StampedeRiskNet' classifier."
    }
  },
  required: ['people', 'metrics', 'heatmap', 'riskLevel']
};

const systemInstruction = `You are SafeFlow, an AI computer vision system emulating YOLOv8 for person detection and a custom classifier 'StampedeRiskNet' for crowd analysis.
Your tasks are:
1.  **Detect People**: Analyze the image to identify all individuals. Return their locations as normalized bounding boxes (x, y, width, height from 0.0 to 1.0).
2.  **Compute Features**: Calculate the following crowd dynamics metrics based on the visual data: density, pressure, velocity variance, flow variance, and the number of velocity spikes.
3.  **Generate Heatmap**: Provide a set of coordinates and intensity values representing areas of high crowd concentration.
4.  **Classify Risk**: Based on the computed features, classify the current situation as 'SAFE', 'RISK', or 'STAMPEDE'.

You MUST return a single, valid JSON object that conforms to the provided schema. Do not include any other text, explanations, or markdown formatting.`;

export const analyzeFrame = async (frameDataUrl: string): Promise<AnalysisResult> => {
  const base64Data = frameDataUrl.split(',')[1];

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: 'image/jpeg',
    },
  };
  
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts: [imagePart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText); 
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
