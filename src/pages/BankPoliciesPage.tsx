import { useState } from 'react';
import { Search, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import AskPageSection from '../components/AskPageSection';
import { bankPolicies } from '../data/bankPolicies';

const BankPoliciesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  // Filter policies based on search term
  const filteredPolicies = bankPolicies.filter(policy => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    // If empty search, show all
    if (!searchLower) {
      return true;
    }
    
    const countryCodeLower = policy.countryCode.toLowerCase();
    const countryLower = policy.country.toLowerCase();
    
    // Exact match for country code takes priority
    if (searchLower === countryCodeLower) {
      return true;
    }
    
    // For country names, only match if search doesn't look like a country code
    // (country codes are typically 2 letters)
    if (searchLower.length > 2) {
      return countryLower.includes(searchLower);
    }
    
    // For 1-2 letter searches, only match exact country codes
    return false;
  });

  // Copy to clipboard function
  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(identifier);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Toggle expanded country for mobile view
  const toggleExpanded = (countryCode: string) => {
    setExpandedCountry(expandedCountry === countryCode ? null : countryCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollRevealContainer>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display">
              Bank <span className="text-gradient">Policies</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-body">
              Country-specific bank details requirements for remittance transactions
            </p>
          </motion.div>

          {/* Ask AI Section */}
          <AskPageSection showButtons={false} />

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by country name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Found {filteredPolicies.length} {filteredPolicies.length === 1 ? 'country' : 'countries'}
            </p>
          </motion.div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block glass-surface rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Account Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      IBAN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Routing Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      ISO Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Sort Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Validations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  <AnimatePresence>
                    {filteredPolicies.map((policy, index) => (
                      <motion.tr
                        key={policy.countryCode}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {policy.country}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {policy.countryCode}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {policy.accountNumber}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {policy.iban}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {policy.routingCode}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {policy.isoCode}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {policy.sortCode}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {policy.comments}
                        </td>
                        <td className="px-4 py-4">
                          {policy.validations.length > 0 ? (
                            <div className="space-y-2">
                              {policy.validations.map((validation, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 group"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-words">
                                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        {validation.field}:
                                      </span>{' '}
                                      {validation.requirement}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        `${validation.field}: ${validation.requirement}`,
                                        `${policy.countryCode}-${idx}`
                                      )
                                    }
                                    className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Copy to clipboard"
                                  >
                                    {copiedField === `${policy.countryCode}-${idx}` ? (
                                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <Copy className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-600">
                              No specific validations
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile Card View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:hidden space-y-4"
          >
            <AnimatePresence>
              {filteredPolicies.map((policy, index) => (
                <motion.div
                  key={policy.countryCode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-surface rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  {/* Card Header */}
                  <button
                    onClick={() => toggleExpanded(policy.countryCode)}
                    className="w-full px-4 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {policy.country}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {policy.countryCode}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCountry === policy.countryCode ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </button>

                  {/* Card Content */}
                  <AnimatePresence>
                    {expandedCountry === policy.countryCode && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-4 space-y-4 bg-white dark:bg-gray-900">
                          <div className="grid grid-cols-1 gap-3">
                            <InfoRow label="Account Number" value={policy.accountNumber} />
                            <InfoRow label="IBAN" value={policy.iban} />
                            <InfoRow label="Routing Code" value={policy.routingCode} />
                            <InfoRow label="ISO Code" value={policy.isoCode} />
                            <InfoRow label="Sort Code" value={policy.sortCode} />
                            {policy.comments !== '-' && (
                              <InfoRow label="Comments" value={policy.comments} />
                            )}
                          </div>

                          {/* Validations */}
                          {policy.validations.length > 0 && (
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Correspondent Validations
                              </h4>
                              <div className="space-y-2">
                                {policy.validations.map((validation, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800/50"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-words">
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                          {validation.field}:
                                        </span>{' '}
                                        {validation.requirement}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          `${validation.field}: ${validation.requirement}`,
                                          `${policy.countryCode}-mobile-${idx}`
                                        )
                                      }
                                      className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                      title="Copy to clipboard"
                                    >
                                      {copiedField === `${policy.countryCode}-mobile-${idx}` ? (
                                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      ) : (
                                        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                      )}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredPolicies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400">
                No countries found matching "{searchTerm}"
              </p>
            </motion.div>
          )}
        </ScrollRevealContainer>
      </div>
    </div>
  );
};

// Helper component for mobile info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-sm text-gray-900 dark:text-white mt-1">
      {value}
    </span>
  </div>
);

export default BankPoliciesPage;

