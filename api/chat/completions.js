export const config = {
  runtime: 'edge',
};

export default async function fetch(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  try {
    const targetUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
    let bodyData = await request.json();

    // 구글이 모르는 설정값 삭제 (에러 방지용)
    delete bodyData.frequency_penalty;
    delete bodyData.repetition_penalty;
    delete bodyData.presence_penalty;
    delete bodyData.top_k;

    const newHeaders = new Headers(request.headers);
    newHeaders.set('Content-Type', 'application/json');
    newHeaders.delete('Content-Length');

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: JSON.stringify(bodyData)
    });

    const responseText = await response.text();
    const newResponse = new Response(responseText, {
      status: response.status,
      headers: response.headers
    });
    
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
