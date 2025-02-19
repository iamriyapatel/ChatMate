// worker.js

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle preflight OPTIONS requests for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Handle POST requests to /chat
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        // Parse the incoming JSON request body
        const body = await request.json();
        const userMessage = body.message;

        if (!userMessage) {
          return new Response(JSON.stringify({ error: 'No message provided.' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        // Call the Gemini API with the user's message
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + env.GEMINI_API_KEY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userMessage,
                  },
                ],
              },
            ],
          }),
        });

        const geminiData = await geminiResponse.json();

        // Log the full Gemini API response for debugging
        console.log('Gemini API Response:', geminiData);

        // Check if Gemini API returned a valid response
        if (!geminiData.candidates || geminiData.candidates.length === 0) {
          return new Response(JSON.stringify({ error: 'Failed to get a response from Gemini API.' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        // Extract the bot's response from Gemini
        const botResponse = geminiData.candidates[0].content.parts[0].text;

        // Return the bot's response as JSON
        return new Response(JSON.stringify({ response: botResponse }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while processing your request.' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Default response for other routes
    return new Response('Welcome to the Gemini Chatbot!', {
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};