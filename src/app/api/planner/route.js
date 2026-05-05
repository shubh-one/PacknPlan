import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    // 1. Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    const { destination, days, budget, travelers, interests } = body;

    if (!destination || !days) {
      return NextResponse.json({ error: 'Destination and duration are required' }, { status: 400 });
    }

    // 3. Input validation
    const numDays = Math.min(Math.max(Number(days), 1), 14);
    const numBudget = Number(budget) || 10000;
    const numTravelers = Math.max(Number(travelers) || 1, 1);

    // 4. Construct the rich prompt
    const prompt = `
      You are an expert Indian travel planner who creates world-class, highly detailed itineraries for travel within India.

      **Trip Details:**
      - Destination: ${destination}
      - Duration: ${numDays} days
      - Total Budget: ₹${numBudget.toLocaleString('en-IN')} (Indian Rupees) for ${numTravelers} traveler(s)
      - Per-person budget: ~₹${Math.round(numBudget / numTravelers).toLocaleString('en-IN')}
      - Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'General sightseeing, culture, and food'}

      **Critical Rules:**
      1. This itinerary MUST be STRICTLY within India. If "${destination}" is not in India, choose the closest similar destination IN India and mention the change in the day title.
      2. ALL costs must be in Indian Rupees (₹). Include realistic estimated costs for each activity.
      3. Stay within the total budget. Make the plan realistic for the given budget range.
      4. Suggest authentic local restaurants, street food, dhabas. Name specific real places where possible.
      5. Include local transport options (auto-rickshaws, metro, local buses, Ola/Uber with estimated fare).
      6. Each day should have 5-8 activities covering morning to evening.
      7. Include a mix of popular tourist spots and hidden local gems.
      8. Add 2-3 practical local tips per day (e.g., best time to visit, what to wear, local customs, bargaining tips).
      9. Pick a single emoji that best represents the destination (e.g., 🏖️ for Goa, 🏔️ for Manali, 🕌 for Agra, 🏛️ for Delhi, 🌊 for Kerala).

      Make it exciting, realistic, and perfectly tailored to the budget!
    `;

    // 5. Define the strict JSON schema with enhanced fields
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        destinationEmoji: {
          type: Type.STRING,
          description: "A single emoji that best represents this destination"
        },
        itinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER, description: "Day number (1, 2, ...)" },
              title: { type: Type.STRING, description: "Theme of the day, e.g. 'Exploring Old Delhi Heritage'" },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 practical local tips for this day"
              },
              activities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING, description: "Time of day, e.g. '9:00 AM'" },
                    activity: { type: Type.STRING, description: "Detailed description of the activity including specific place names" },
                    type: { type: Type.STRING, description: "One of: transport, hotel, food, sightseeing, culture, nature, adventure, wellness, shopping, nightlife" },
                    emoji: { type: Type.STRING, description: "A relevant emoji for this activity" },
                    estimatedCost: { type: Type.STRING, description: "Estimated cost in ₹ for this activity, e.g. '₹200' or '₹500-800' or 'Free'" }
                  },
                  required: ["time", "activity", "type", "emoji", "estimatedCost"]
                }
              }
            },
            required: ["day", "title", "activities", "tips"]
          }
        }
      },
      required: ["destinationEmoji", "itinerary"]
    };

    // 6. Call the Gemini API with retry logic and fallback model
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError = null;

    for (const modelName of models) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Planner: trying ${modelName} (attempt ${attempt}/3)`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            }
          });

          // 7. Parse and return the generated JSON
          const result = JSON.parse(response.text);
          if (result.itinerary && Array.isArray(result.itinerary)) {
            result.itinerary = result.itinerary.map(day => ({
              ...day,
              items: day.activities || day.items || [],
              activities: undefined,
            }));
          }
          console.log(`Planner: success with ${modelName} on attempt ${attempt}`);
          return NextResponse.json(result);
        } catch (err) {
          lastError = err;
          const errStr = err.message || '';
          const isRetryable = errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand')
            || errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');
          const retryDelay = errStr.includes('429') ? attempt * 5000 : attempt * 2000;
          console.log(`Planner: ${modelName} attempt ${attempt} failed — ${isRetryable ? 'retryable' : 'fatal'}: ${errStr.slice(0, 100)}`);
          if (isRetryable && attempt < 3) {
            await new Promise(r => setTimeout(r, retryDelay));
            continue;
          }
          break;
        }
      }
    }

    // All models/attempts failed — Ultimate Fallback: Return a Mock Itinerary
    console.error('Planner API Error (all retries exhausted, falling back to offline mock):', lastError?.message);

    const dailyBudget = Math.round(numBudget / numDays);
    const mockItinerary = {
      destinationEmoji: "🌟",
      itinerary: Array.from({ length: numDays }).map((_, i) => ({
        day: i + 1,
        title: `Discovering ${destination} - Day ${i + 1}`,
        tips: [
          "Start your day early to avoid crowds.",
          "Keep local currency handy for small purchases.",
          "Stay hydrated and wear comfortable walking shoes."
        ],
        items: [
          { time: "09:00 AM", activity: `Morning exploration at popular spots in ${destination}`, type: "sightseeing", emoji: "🏛️", estimatedCost: `₹${Math.round(dailyBudget * 0.1)}` },
          { time: "01:00 PM", activity: "Lunch at a famous local restaurant", type: "food", emoji: "🍛", estimatedCost: `₹${Math.round(dailyBudget * 0.3)}` },
          { time: "03:00 PM", activity: "Cultural tour and local shopping", type: "shopping", emoji: "🛍️", estimatedCost: `₹${Math.round(dailyBudget * 0.4)}` },
          { time: "07:00 PM", activity: "Relaxing evening and dinner", type: "food", emoji: "🍽️", estimatedCost: `₹${Math.round(dailyBudget * 0.2)}` }
        ]
      }))
    };

    return NextResponse.json(mockItinerary);
  } catch (error) {
    console.error('Planner API Error (unexpected):', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
