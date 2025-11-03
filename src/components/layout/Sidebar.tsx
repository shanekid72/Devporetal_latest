import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  BookOpen, 
  Key,
  Code, 
  Shield, 
  UserCircle,
  DollarSign,
  X,
  RefreshCw,
  FileText,
  CheckCircle,
  Cpu,
  Zap,
  GitBranch,
  Settings,
  Target,
  Home,
  Users
} from 'lucide-react';
import { NavigationItem } from '../../types';
import clsx from 'clsx';

interface SidebarProps {
  onClose: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'BookOpen',
    children: [
      { id: 'api-introduction', title: 'API Introduction', href: '/introduction' },
      { id: 'authentication', title: 'Authentication', href: '/authentication' },
    ],
  },
  {
    id: 'core-resources',
    title: 'Core Resources', 
    icon: 'Code',
    children: [
      { id: 'auth-endpoints', title: 'Authentication', href: '/api-reference/auth' },
      { id: 'masters', title: 'Masters', href: '/api-reference/masters' },
      { 
        id: 'customer-onboarding', 
        title: 'Customer Onboarding', 
        children: [
          { id: 'customer-individual', title: 'Individual', href: '/api-reference/customer' },
          { id: 'customer-business', title: 'Business', href: '/api-reference/customer/business' },
        ],
      },
      { id: 'beneficiary', title: 'Beneficiary Onboarding', href: '/api-reference/beneficiary' },
      { 
        id: 'remittance', 
        title: 'Remittance', 
        children: [
          { id: 'remittance-individual', title: 'Individual', href: '/api-reference/remittance' },
          { id: 'remittance-business', title: 'Business', href: '/api-reference/remittance/business' },
        ],
      },
    ],
  },
  {
    id: 'agent-toolkit',
    title: 'Agent Toolkit',
    icon: 'Cpu',
    children: [
      { id: 'agent-intro', title: 'Introduction', href: '/agent-toolkit' },
      {
        id: 'quickstart-guides',
        title: 'Quickstart Guides',
        icon: 'Zap',
        children: [
          { id: 'payments-quickstart', title: 'Payments', href: '/agent-toolkit/quickstart/payments' },
          { id: 'mcp-quickstart', title: 'MCP', href: '/agent-toolkit/quickstart/mcp' },
          { id: 'llm-integration', title: 'LLM Integration', href: '/agent-toolkit/quickstart/llm-integration' }
        ]
      },
      {
        id: 'reference',
        title: 'Reference',
        icon: 'FileText',
        children: [
          { id: 'agent-tools', title: 'Agent Tools', href: '/agent-toolkit/reference/agent-tools' }
        ]
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        icon: 'Target',
        children: [
          { id: 'integration-practices', title: 'Integration', href: '/agent-toolkit/best-practices/integration' },
          { id: 'prompting-practices', title: 'Prompting & Agents', href: '/agent-toolkit/best-practices/prompting' }
        ]
      }
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: 'FileText',
    children: [
      { id: 'api-swagger', title: 'API Specification', href: '/api-reference-swagger' },
      { id: 'downloads', title: 'Downloads', href: '/downloads' },
      { id: 'changelog', title: 'Changelog', href: '/changelog' },
    ],
  }
];

const iconMap = {
  BookOpen,
  Key,
  Code,
  Shield,
  UserCircle,
  DollarSign,
  RefreshCw,
  FileText,
  CheckCircle,
  Cpu,
  Zap,
  GitBranch,
  Settings,
  Target,
  Users
};

// Helper function to get all expandable item IDs
const getAllExpandableIds = (items: NavigationItem[]): string[] => {
  const expandableIds: string[] = [];
  
  const traverse = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      expandableIds.push(item.id);
      item.children.forEach(child => traverse(child));
    }
  };
  
  items.forEach(item => traverse(item));
  return expandableIds;
};

// Helper function to filter navigation based on portal type
const getFilteredNavigation = (portalType: 'whitelabelled' | 'lfi'): NavigationItem[] => {
  if (portalType === 'whitelabelled') {
    return navigationItems;
  }
  
  // For LFI: Remove "Customer Onboarding" and "Beneficiary Onboarding" from Core Resources
  return navigationItems.map(item => {
    if (item.id === 'core-resources' && item.children) {
      return {
        ...item,
        children: item.children.filter(child => 
          child.id !== 'customer-onboarding' && 
          child.id !== 'beneficiary'
        )
      };
    }
    return item;
  });
};

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  // Portal type selection state (accordion behavior)
  const [selectedPortalType, setSelectedPortalType] = useState<'whitelabelled' | 'lfi'>(() => {
    const saved = localStorage.getItem('selected_portal_type');
    return (saved === 'whitelabelled' || saved === 'lfi') ? saved : 'whitelabelled';
  });
  // All sections collapsed by default on first load
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Listen for portal type changes
  useEffect(() => {
    const handlePortalTypeChange = () => {
      const saved = localStorage.getItem('selected_portal_type');
      const newType = (saved === 'whitelabelled' || saved === 'lfi') ? saved : 'whitelabelled';
      setSelectedPortalType(newType);
    };

    // Listen for custom event
    window.addEventListener('portalTypeChanged', handlePortalTypeChange);
    
    // Also listen for storage events (cross-tab changes)
    window.addEventListener('storage', handlePortalTypeChange);

    return () => {
      window.removeEventListener('portalTypeChanged', handlePortalTypeChange);
      window.removeEventListener('storage', handlePortalTypeChange);
    };
  }, []);
  
  // Get filtered navigation based on selected portal type
  const currentNavigation = getFilteredNavigation(selectedPortalType);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAllExpanded = () => {
    const allIds = getAllExpandableIds(currentNavigation);
    const isAllExpanded = allIds.every(id => expandedItems.includes(id));
    
    if (isAllExpanded) {
      // Collapse all
      setExpandedItems([]);
    } else {
      // Expand all
      setExpandedItems(allIds);
    }
  };


  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isParentActive = (children: NavigationItem[]) => {
    return children.some(child => child.href && isActive(child.href));
  };


  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap] || BookOpen;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const parentActive = hasChildren && isParentActive(item.children!);

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <motion.button
            onClick={() => toggleExpanded(item.id)}
            className={clsx(
              'nav-item w-full justify-between interactive-glow font-display',
              parentActive && 'active'
            )}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              {item.icon && (
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
              )}
              <span className="whitespace-nowrap">{item.title}</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-8 mt-1 space-y-1">
                  {item.children!.map(child => renderNavigationItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <motion.div
        key={item.id}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={item.href || '#'}
          onClick={onClose}
          className={clsx(
            'nav-item w-full interactive-glow font-body',
            item.href && isActive(item.href) && 'active'
          )}
        >
          <div className="flex items-center space-x-3">
            {level === 0 && (
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
            )}
            <span className="whitespace-nowrap">{item.title}</span>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header - Mobile only, Modern Enhanced */}
      <motion.div 
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 lg:hidden glass-surface"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-sm font-medium text-gray-900 dark:text-white font-display">
          <span className="text-gradient">API</span> Reference
        </h2>
        <motion.button
          onClick={onClose}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 interactive-glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Home Link - Return to Landing Page */}
      <motion.div 
        className="hidden lg:flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 glass-surface"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center space-x-2 px-2 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 interactive-glow font-display group"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Home
          </span>
        </Link>
        <motion.button
          onClick={toggleAllExpanded}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200 interactive-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="h-3 w-3" />
          <span>
            {getAllExpandableIds(currentNavigation).every(id => expandedItems.includes(id)) 
              ? 'Collapse All' 
              : 'Expand All'
            }
          </span>
        </motion.button>
      </motion.div>

      {/* Model Indicator Badge - replaces search */}
      <motion.div 
        className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 glass-surface"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            {selectedPortalType === 'lfi' ? '📍 LFI' : '📍 White-labelled'}
          </span>
        </div>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <motion.nav 
          className="px-4 py-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-6">
            {currentNavigation.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {renderNavigationItem(item)}
              </motion.div>
            ))}
          </div>
        </motion.nav>
      </div>

      {/* Footer - Modern Enhanced */}
      <motion.div 
        className="p-4 border-t border-gray-200 dark:border-gray-800 glass-surface"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="text-xs text-gray-500 dark:text-gray-500 font-body">
          <motion.p
            whileHover={{ scale: 1.02 }}
            className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span className="text-gradient-accent font-display font-medium">v2.0</span> • Updated October 2025
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar; 