import ScrollRevealContainer from '../components/ScrollRevealContainer';

const RemittanceBusinessPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollRevealContainer>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Remittance - Business
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Business remittance APIs are coming soon.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              🚧 Under Development
            </span>
          </div>
          <div className="mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This section will include APIs for business-to-business remittance transactions, 
              bulk payments, and corporate remittance solutions.
            </p>
          </div>
        </div>
      </ScrollRevealContainer>
    </div>
  );
};

export default RemittanceBusinessPage;

