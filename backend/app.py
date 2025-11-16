from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="QuickLead Backend")

# Blocked domains list
BLOCKED_DOMAINS = ["google.com", "scholar.google.com"]

@app.post("/summarize")
async def summarize(request: Request):
    data = await request.json()
    query = data.get("query")
    if not query:
        return JSONResponse(content={"error": "Query is required"}, status_code=400)

    # Simulate summary generation
    summary = f"Summary for leadership topic: {query}"

    # Example resources
    resources = [
        {"title": "Leadership in Modern Organizations", "type": "journal", "source": "Harvard Business Review", "url": "https://hbr.org/article"},
        {"title": "Effective Leadership Strategies", "type": "blog", "source": "Medium", "url": "https://medium.com/leadership-strategies"},
        {"title": "Google Scholar Leadership Paper", "type": "paper", "source": "Google Scholar", "url": "https://scholar.google.com/leadership-paper"},
        {"title": "Transformational Leadership Research", "type": "journal", "source": "ScienceDirect", "url": "https://www.sciencedirect.com/article"}
    ]

    # Filter blocked domains
    filtered_resources = []
    for resource in resources:
        try:
            domain = resource["url"].split("//")[-1].split("/")[0]
            if not any(blocked in domain for blocked in BLOCKED_DOMAINS):
                filtered_resources.append(resource)
        except:
            continue

    return {"query": query, "summary": summary, "resources": filtered_resources}

