// Supabase Edge Function: quicklead-search
// Filters blocked URLs and returns leadership resources
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid query' }), { status: 400 });
    }
    const summary = `Summary for leadership topic: ${query}`;
    let resources = [
      { title: 'Leadership in Modern Organizations', type: 'journal', source: 'Harvard Business Review', url: 'https://hbr.org/article' },
      { title: 'Effective Leadership Strategies', type: 'blog', source: 'Medium', url: 'https://medium.com/leadership-strategies' },
      { title: 'Google Scholar Leadership Paper', type: 'paper', source: 'Google Scholar', url: 'https://scholar.google.com/leadership-paper' },
      { title: 'Transformational Leadership Research', type: 'journal', source: 'ScienceDirect', url: 'https://www.sciencedirect.com/article' }
    ];
    const blockedDomains = ['google.com', 'scholar.google.com'];
    resources = resources.filter(resource => {
      try {
        const domain = new URL(resource.url).hostname;
        return !blockedDomains.some(blocked => domain.includes(blocked));
      } catch {
        return false;
      }
    });
    return new Response(JSON.stringify({ query, summary, resources }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
