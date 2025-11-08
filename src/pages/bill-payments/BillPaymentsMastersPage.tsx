import { useState, useEffect } from 'react';
import { Search, Code, Filter, XCircle } from 'lucide-react';
import { APIEndpoint } from '../../types';
import ScrollRevealContainer from '../../components/ScrollRevealContainer';
import ApiEndpointCard from '../../components/ApiEndpointCard';
import AskPageSection from '../../components/AskPageSection';
import { Theme } from '../../types';
import { billPaymentsApiSections } from '../../data/billPaymentsApiSections';
import { createApiTryItHandler } from '../../utils/apiTryItHandler';

const BillPaymentsMastersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [filteredEndpoints, setFilteredEndpoints] = useState<APIEndpoint[]>([]);
  const theme: Theme = { mode: 'light' };
  const handleTryIt = createApiTryItHandler();

  // Filter endpoints based on search and method filter
  useEffect(() => {
    const currentSection = billPaymentsApiSections.masters[0];
    let endpoints = currentSection.endpoints;

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      endpoints = endpoints.filter(endpoint => 
        endpoint.title.toLowerCase().includes(query) ||
        endpoint.path.toLowerCase().includes(query) ||
        endpoint.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply method filter if selected
    if (selectedMethod) {
      endpoints = endpoints.filter(endpoint => 
        endpoint.method === selectedMethod
      );
    }
    
    setFilteredEndpoints(endpoints);
  }, [searchQuery, selectedMethod]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMethod(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h1 id="api-reference" className="text-3xl font-bold text-gray-900 dark:text-white">
              Masters APIs
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Retrieve master data including rates, categories, providers, billers, and service parameters for bill payment operations.
          </p>
        </div>
      </ScrollRevealContainer>

      {/* AskPage Section */}
      <ScrollRevealContainer>
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/51c6bfb1-107e-4eb7-a579-2311c9f4c738?authuser=5" />
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Overview
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The Masters API provides reference data endpoints for accessing system codes, exchange rates, 
              bill payment categories, providers, billers, and other master data required for bill payment operations.
            </p>
            <p>
              Base URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono">https://api.digitnine.com</code>
            </p>
          </div>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            API Endpoints
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative inline-block">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md inline-flex items-center space-x-2 ${
                    selectedMethod === 'GET'
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(selectedMethod === 'GET' ? null : 'GET')}
                >
                  <span>GET</span>
                </button>
              </div>
              
              <div className="relative inline-block">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md inline-flex items-center space-x-2 ${
                    selectedMethod === 'POST'
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(selectedMethod === 'POST' ? null : 'POST')}
                >
                  <span>POST</span>
                </button>
              </div>

              {(searchQuery || selectedMethod) && (
                <button
                  onClick={clearFilters}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Clear filters"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedMethod) && (
            <div className="mb-6 flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  Search: "{searchQuery}"
                </span>
              )}
              
              {selectedMethod && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  Method: {selectedMethod}
                </span>
              )}
              
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* API Endpoints */}
          <div>
            {filteredEndpoints.length > 0 ? (
              <div className="space-y-6">
                {filteredEndpoints.map((endpoint) => (
                  <ApiEndpointCard
                    key={endpoint.id}
                    method={endpoint.method}
                    path={endpoint.path}
                    title={endpoint.title}
                    description={endpoint.description || ''}
                    requestBody={endpoint.requestBody}
                    requestHeaders={endpoint.requestHeaders}
                    responseBody={endpoint.responseBody}
                    pathParams={endpoint.pathParams}
                    queryParams={endpoint.queryParams}
                    codeExamples={endpoint.codeExamples}
                    guidelines={endpoint.guidelines}
                    errorCodes={endpoint.errorCodes}
                    theme={theme}
                    onTryIt={async (editableBody, editableHeaders, editableQueryParams, editablePathParams) => {
                      return await handleTryIt(endpoint, editableBody, editableHeaders, editableQueryParams, editablePathParams || {});
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No endpoints found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchQuery || selectedMethod 
                    ? "No endpoints match your current filters. Try adjusting or clearing your filters."
                    : "There are no endpoints available in this category."}
                </p>
                {(searchQuery || selectedMethod) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollRevealContainer>
    </div>
  );
};

export default BillPaymentsMastersPage;

