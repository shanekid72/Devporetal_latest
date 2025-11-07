import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import MainLayout from './components/layout/MainLayout';
import { Theme } from './types';

// Lazy load all route components for better code splitting
const SplineRobotHome = lazy(() => import('./components/SplineRobotHome'));
const IntroductionPage = lazy(() => import('./pages/IntroductionPage'));
const AuthenticationPage = lazy(() => import('./pages/AuthenticationPage'));
const PortalOverviewPage = lazy(() => import('./pages/PortalOverviewPage'));
const AgentToolkitIntroductionPage = lazy(() => import('./pages/agent-toolkit/AgentToolkitIntroductionPage'));
const IntegrationBestPracticesPage = lazy(() => import('./pages/agent-toolkit/best-practices/IntegrationBestPracticesPage'));
const PromptingBestPracticesPage = lazy(() => import('./pages/agent-toolkit/best-practices/PromptingBestPracticesPage'));
const LLMIntegrationPage = lazy(() => import('./pages/agent-toolkit/quickstart/LLMIntegrationPage'));
const MCPQuickstartPage = lazy(() => import('./pages/agent-toolkit/quickstart/MCPQuickstartPage'));
const PaymentsQuickstartPage = lazy(() => import('./pages/agent-toolkit/quickstart/PaymentsQuickstartPage'));
const AgentToolsReferencePage = lazy(() => import('./pages/agent-toolkit/reference/AgentToolsReferencePage'));
const APIReferencePage = lazy(() => import('./pages/APIReferencePage'));
const SandboxTestingPage = lazy(() => import('./pages/SandboxTestingPage'));
const APIReference = lazy(() => import('./pages/APIReference'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const BankPoliciesPage = lazy(() => import('./pages/BankPoliciesPage'));

// Bill Payments pages
const BillPaymentsIntroductionPage = lazy(() => import('./pages/bill-payments/BillPaymentsIntroductionPage'));
const BillPaymentsAuthenticationPage = lazy(() => import('./pages/bill-payments/BillPaymentsAuthenticationPage'));
const GetRatesPage = lazy(() => import('./pages/bill-payments/masters/GetRatesPage'));
const GetCategoriesPage = lazy(() => import('./pages/bill-payments/masters/GetCategoriesPage'));
const GetProvidersPage = lazy(() => import('./pages/bill-payments/masters/GetProvidersPage'));
const GetBillersPage = lazy(() => import('./pages/bill-payments/masters/GetBillersPage'));
const GetBillerCustomParamsPage = lazy(() => import('./pages/bill-payments/masters/GetBillerCustomParamsPage'));
const GetBillerPlansPage = lazy(() => import('./pages/bill-payments/masters/GetBillerPlansPage'));
const CreateQuotePage = lazy(() => import('./pages/bill-payments/transactions/CreateQuotePage'));
const CreateTransactionPage = lazy(() => import('./pages/bill-payments/transactions/CreateTransactionPage'));
const ConfirmTransactionPage = lazy(() => import('./pages/bill-payments/transactions/ConfirmTransactionPage'));
const EnquireTransactionPage = lazy(() => import('./pages/bill-payments/transactions/EnquireTransactionPage'));

// Integration pages
const WhiteLabelledPage = lazy(() => import('./pages/integration/WhiteLabelledPage'));
const LFIPage = lazy(() => import('./pages/integration/LFIPage'));
const EWAPage = lazy(() => import('./pages/integration/EWAPage'));

// EWA API pages
const EWAAuthenticationPage = lazy(() => import('./pages/integration/ewa/EWAAuthenticationPage'));
const CheckEligibilityPage = lazy(() => import('./pages/integration/ewa/CheckEligibilityPage'));
const FetchPricePage = lazy(() => import('./pages/integration/ewa/FetchPricePage'));
const RecordConsentPage = lazy(() => import('./pages/integration/ewa/RecordConsentPage'));
const CreateSalaryAdvancePage = lazy(() => import('./pages/integration/ewa/CreateSalaryAdvancePage'));
const GetSalaryAdvancePage = lazy(() => import('./pages/integration/ewa/GetSalaryAdvancePage'));
const CancelApplicationPage = lazy(() => import('./pages/integration/ewa/CancelApplicationPage'));

// WPS API pages
const WPSAuthenticationPage = lazy(() => import('./pages/integration/wps/WPSAuthenticationPage'));
const WPSUploadSalaryPage = lazy(() => import('./pages/integration/wps/WPSUploadSalaryPage'));
const WPSGetFileStatusPage = lazy(() => import('./pages/integration/wps/WPSGetFileStatusPage'));

// Info pages
const WPSPage = lazy(() => import('./pages/integration/WPSPage'));
const UseCaseBillPaymentsPage = lazy(() => import('./pages/UseCaseBillPaymentsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const Digit9Page = lazy(() => import('./pages/Digit9Page'));

// API pages
const CustomerBusinessPage = lazy(() => import('./pages/CustomerBusinessPage'));
const BeneficiaryPage = lazy(() => import('./pages/BeneficiaryPage'));
const RemittanceBusinessPage = lazy(() => import('./pages/RemittanceBusinessPage'));

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const [theme, setTheme] = useState<Theme>({ mode: 'light' });
  const appRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.config({
        autoSleep: 60,
        force3D: true,
      });

      ScrollTrigger.config({
        ignoreMobileResize: true,
      });

      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.defaults({
        scrub: true,
      });
    }, appRef);

    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      ctx.revert();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    // Always default to light theme, only use saved preference if user has explicitly chosen
    const initialTheme = savedTheme || 'light';
    setTheme({ mode: initialTheme });

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme({ mode: newMode });
    localStorage.setItem('theme', newMode);

    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.div
      ref={appRef}
      className="min-h-screen bg-white dark:bg-gray-950 scroll-smooth"
      data-scroll-container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout 
        theme={theme} 
        onThemeToggle={toggleTheme} 
        hideNavigation={location.pathname === '/'}
        showSidebar={
          location.pathname.startsWith('/integration/') ||
          location.pathname.startsWith('/introduction') ||
          location.pathname.startsWith('/authentication') ||
          location.pathname.startsWith('/api-reference') ||
          location.pathname.startsWith('/agent-toolkit') ||
          location.pathname.startsWith('/sandbox-testing') ||
          location.pathname.startsWith('/guides/') ||
          location.pathname.startsWith('/policies') ||
          location.pathname.startsWith('/downloads') ||
          location.pathname.startsWith('/changelog')
        }
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
            {/* Landing */}
            <Route path="/" element={<SplineRobotHome />} />

            {/* Portal Overview - no sidebar */}
            <Route path="/portal-overview" element={<PortalOverviewPage />} />

            {/* Integration Model - with sidebar */}
            <Route path="/integration/white-labelled" element={<WhiteLabelledPage />} />
            <Route path="/integration/lfi" element={<LFIPage />} />
            <Route path="/integration/ewa" element={<EWAPage />} />
            <Route path="/integration/wps" element={<WPSPage />} />
            
            {/* EWA APIs - with sidebar */}
            <Route path="/integration/ewa/authentication" element={<EWAAuthenticationPage theme={theme} />} />
            <Route path="/integration/ewa/check-eligibility" element={<CheckEligibilityPage />} />
            <Route path="/integration/ewa/fetch-price" element={<FetchPricePage />} />
            <Route path="/integration/ewa/record-consent" element={<RecordConsentPage />} />
            <Route path="/integration/ewa/create-salary-advance" element={<CreateSalaryAdvancePage />} />
            <Route path="/integration/ewa/get-salary-advance" element={<GetSalaryAdvancePage />} />
            <Route path="/integration/ewa/cancel-application" element={<CancelApplicationPage />} />
            
            {/* WPS APIs - with sidebar */}
            <Route path="/integration/wps/authentication" element={<WPSAuthenticationPage theme={theme} />} />
            <Route path="/integration/wps/upload-salary" element={<WPSUploadSalaryPage theme={theme} />} />
            <Route path="/integration/wps/get-file-status" element={<WPSGetFileStatusPage theme={theme} />} />

            {/* Integration Model - Bill Payments - with sidebar */}
            <Route path="/integration/bill-payments" element={<UseCaseBillPaymentsPage />} />
            <Route path="/integration/bill-payments/introduction" element={<BillPaymentsIntroductionPage />} />
            <Route path="/integration/bill-payments/authentication" element={<BillPaymentsAuthenticationPage />} />
            
            {/* Bill Payments - Masters APIs */}
            <Route path="/integration/bill-payments/masters/get-rates" element={<GetRatesPage />} />
            <Route path="/integration/bill-payments/masters/get-categories" element={<GetCategoriesPage />} />
            <Route path="/integration/bill-payments/masters/get-providers" element={<GetProvidersPage />} />
            <Route path="/integration/bill-payments/masters/get-billers" element={<GetBillersPage />} />
            <Route path="/integration/bill-payments/masters/get-biller-custom-params" element={<GetBillerCustomParamsPage />} />
            <Route path="/integration/bill-payments/masters/get-biller-plans" element={<GetBillerPlansPage />} />
            
            {/* Bill Payments - Transaction APIs */}
            <Route path="/integration/bill-payments/transactions/create-quote" element={<CreateQuotePage />} />
            <Route path="/integration/bill-payments/transactions/create-transaction" element={<CreateTransactionPage />} />
            <Route path="/integration/bill-payments/transactions/confirm-transaction" element={<ConfirmTransactionPage />} />
            <Route path="/integration/bill-payments/transactions/enquire-transaction" element={<EnquireTransactionPage />} />

            {/* Info pages - no sidebar */}
            <Route path="/support" element={<SupportPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/digit9" element={<Digit9Page />} />

            {/* Getting Started - with sidebar */}
            <Route path="/introduction" element={<IntroductionPage />} />
            <Route path="/authentication" element={<AuthenticationPage theme={theme} />} />

            {/* Agent Toolkit - with sidebar */}
            <Route path="/agent-toolkit" element={<AgentToolkitIntroductionPage theme={theme} />} />
            <Route path="/agent-toolkit/quickstart/payments" element={<PaymentsQuickstartPage theme={theme} />} />
            <Route path="/agent-toolkit/quickstart/mcp" element={<MCPQuickstartPage theme={theme} />} />
            <Route path="/agent-toolkit/quickstart/llm-integration" element={<LLMIntegrationPage theme={theme} />} />
            <Route path="/agent-toolkit/reference/agent-tools" element={<AgentToolsReferencePage theme={theme} />} />
            <Route path="/agent-toolkit/best-practices/integration" element={<IntegrationBestPracticesPage theme={theme} />} />
            <Route path="/agent-toolkit/best-practices/prompting" element={<PromptingBestPracticesPage theme={theme} />} />

            {/* API Reference - with sidebar */}
            <Route path="/api-reference" element={<Navigate to="/api-reference/auth" replace />} />
            <Route path="/api-reference/:endpointId" element={<APIReferencePage theme={theme} />} />
            <Route path="/api-reference-swagger" element={<APIReference theme={theme} />} />
            <Route path="/api-reference/customer/business" element={<CustomerBusinessPage theme={theme} />} />
            <Route path="/api-reference/beneficiary" element={<BeneficiaryPage theme={theme} />} />
            <Route path="/api-reference/remittance/business" element={<RemittanceBusinessPage />} />

            {/* Sandbox - with sidebar */}
            <Route path="/sandbox-testing" element={<SandboxTestingPage />} />

            {/* Resources - with sidebar */}
            <Route path="/guides/onboarding" element={<PlaceholderPage />} />
            <Route path="/guides/transactions" element={<PlaceholderPage />} />
            <Route path="/guides/rates" element={<PlaceholderPage />} />
            <Route path="/guides/errors" element={<PlaceholderPage />} />
            <Route path="/policies" element={<BankPoliciesPage />} />
            <Route path="/downloads" element={<PlaceholderPage />} />
            <Route path="/changelog" element={<PlaceholderPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </motion.div>
  );
}

export default App;
