import { useState, useRef, useCallback } from "react";
import { Hero } from "@/components/Hero";
import { SearchSection } from "@/components/SearchSection";
import ResultsSection from "@/components/ResultsSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

function showErrorToast(error, toast) {
  if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
    toast({ title: "Rate Limit Exceeded", description: "Too many requests. Please try again in a moment.", variant: "destructive" });
  } else if (error.message?.includes('402') || error.message?.includes('credits')) {
    toast({ title: "AI Credits Exhausted", description: "Please add credits to continue using AI features.", variant: "destructive" });
  } else {
    toast({ title: "Search Failed", description: "Unable to complete search. Please try again.", variant: "destructive" });
  }
}

function sanitizeQuery(query) {
  let sanitized = query.trim();
  sanitized = sanitized.replace(/<[^>]*>?/gm, '');
  sanitized = sanitized.replace(/[^a-zA-Z0-9 .,?!'-]/g, '');
  return sanitized;
}

const QuickLead = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const { toast } = useToast();

  const handleSearch = useCallback(async (query) => {
    const safeQuery = sanitizeQuery(query);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('quicklead-search', { body: { query: safeQuery } });
      if (error) {
        showErrorToast(error, toast);
        return;
      }
      if (data) {
        setSearchResults(data);
        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
      }
    } catch (error) {
      showErrorToast(error, toast);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSearchFocus = useCallback(() => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => searchRef.current?.focus(), 500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero onSearchFocus={handleSearchFocus} />
      <SearchSection onSearch={handleSearch} searchRef={searchRef} isLoading={isLoading} aria-label="QuickLead topic search" />
      {isLoading && <div role="status" aria-live="polite" className="text-center py-8">Loading...</div>}
      {!isLoading && !searchResults && (<p className="text-center py-8 text-muted-foreground">No results yet. Try searching for a leadership topic!</p>)}
      {searchResults && (<ResultsSection query={searchResults.query} summary={searchResults.summary} resources={searchResults.resources} />)}
    </div>
  );
};

export default QuickLead;
