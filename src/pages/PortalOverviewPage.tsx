import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code, 
  Cpu, 
  Download, 
  Key, 
  Zap,
  DollarSign,
  Shield,
  BookOpen
} from 'lucide-react';
import { Theme } from '../types';

interface PortalOverviewPageProps {
  theme?: Theme;
}

const PortalOverviewPage: React.FC<PortalOverviewPageProps> = () => {
  const features = [
    {
      id: 'explore-apis',
      title: 'Explore Live APIs',
      description: 'Test endpoints in real-time with instant responses and detailed documentation.',
      icon: Code,
      link: '/api-reference',
      category: 'Core'
    },
    {
      id: 'build-agents',
      title: 'Build AI Agents',
      description: 'Create intelligent agents with our comprehensive toolkit and ready-to-use templates.',
      icon: Cpu,
      link: '/agent-toolkit',
      category: 'AI'
    },
    {
      id: 'try-instantly',
      title: 'Try It Instantly',
      description: 'No setup required - test APIs directly in your browser with live data.',
      icon: Zap,
      link: '/api-reference',
      category: 'Core'
    },
    {
      id: 'download-templates',
      title: 'Download Templates',
      description: 'Grab complete project templates as ZIP files for quick development.',
      icon: Download,
      link: '/agent-toolkit',
      category: 'Tools'
    },
    {
      id: 'process-payments',
      title: 'Process Payments',
      description: 'Integrate global remittance and payment APIs with enterprise-grade security.',
      icon: DollarSign,
      link: '/api-reference/remittance',
      category: 'APIs'
    },
    {
      id: 'enterprise-security',
      title: 'Enterprise Security',
      description: 'Production-ready authentication patterns and security best practices.',
      icon: Shield,
      link: '/getting-started/authentication',
      category: 'Security'
    },
    {
      id: 'smart-docs',
      title: 'Smart Documentation',
      description: 'Interactive guides with working code examples in 10+ programming languages.',
      icon: BookOpen,
      link: '/api-reference',
      category: 'Docs'
    },
    {
      id: 'api-authentication',
      title: 'API Authentication',
      description: 'Learn token-based authentication with step-by-step implementation guides.',
      icon: Key,
      link: '/getting-started/authentication',
      category: 'Security'
    }
  ];

  const quickNavigation = [
    {
      title: 'Agent Toolkit',
      description: 'Start building AI agents',
      link: '/agent-toolkit',
      category: 'Popular'
    },
    {
      title: 'API Reference',
      description: 'Explore all available APIs',
      link: '/api-reference',
      category: 'Popular'
    },
    {
      title: 'Authentication',
      description: 'Get started with API auth',
      link: '/getting-started/authentication',
      category: 'Getting Started'
    },
    {
      title: 'Quick Start',
      description: 'Begin your integration',
      link: '/introduction',
      category: 'Getting Started'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Developer Portal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Your AI-Powered Development Hub
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Build intelligent applications with our comprehensive APIs, AI agent toolkit, and enterprise-grade infrastructure.
            From documentation to deployment - everything you need in one place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Portal Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Link
                    to={feature.link}
                    className="block p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="flex items-center mt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-500 mr-2">
                            {feature.category}
                          </span>
                          <ArrowRight className="h-3 w-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Quick Navigation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickNavigation.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -1 }}
              >
                <Link
                  to={item.link}
                  className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Getting Started Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Choose your path: explore our comprehensive API documentation, dive into AI agent development, 
            or start with our quick setup guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/introduction"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              <Zap className="h-4 w-4 mr-2" />
              Quick Start Guide
            </Link>
            <Link
              to="/agent-toolkit"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
            >
              <Cpu className="h-4 w-4 mr-2" />
              Agent Toolkit
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalOverviewPage;


