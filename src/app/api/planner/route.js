import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    // 1. Check if user is authenticated
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    const { destination, days, budget, travelers, interests } = body;

    if (!destination || !days) {
      return NextResponse.json({ error: 'Destination and duration are required' }, { status: 400 });
    }

    // 3. Construct the prompt
    const prompt = `
      You are an expert travel agent. Create a detailed daily travel itinerary for a trip to ${destination}.
      - Duration: ${days} days
      - Budget: $${budget}
      - Number of Travelers: ${travelers}
      - Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'General tourist attractions'}

      Please structure the output as an array of days. Each day should have a title and a list of activities (items) with specific times. Make it realistic, exciting, and tailored to the budget and interests.
    `;

    // 4. Define the strict JSON schema
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "Day number (1, 2, ...)" },
          title: { type: Type.STRING, description: "Theme of the day" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Time of day, e.g. 10:00 AM" },
                activity: { type: Type.STRING, description: "Description of the activity" },
                type: { type: Type.STRING, description: "Category like transport, hotel, food, beach, culture, nature, adventure, wellness, etc" },
                emoji: { type: Type.STRING, description: "A relevant emoji" }
              },
              required: ["time", "activity", "type", "emoji"]
            }
          }
        },
        required: ["day", "title", "items"]
      }
    };

    // 5. Call the Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    // 6. Parse and return the generated JSON
    const itinerary = JSON.parse(response.text);
    return NextResponse.json(itinerary);

  } catch (error) {
    console.error('Planner API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
