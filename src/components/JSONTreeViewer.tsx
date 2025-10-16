import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Copy, 
  Search, 
  Eye, 
  FileText,
  Hash,
  Type,
  CheckCircle
} from 'lucide-react';

interface JSONTreeViewerProps {
  data: any;
  className?: string;
  maxHeight?: string;
}

interface JSONNodeProps {
  value: any;
  keyName?: string | number;
  level: number;
  path: string;
  searchTerm: string;
  onCopy: (value: any, path: string) => void;
}

const JSONNode: React.FC<JSONNodeProps> = ({ 
  value, 
  keyName, 
  level, 
  path, 
  searchTerm, 
  onCopy 
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const [copied, setCopied] = useState(false);

  const handleCopy = async (data: any) => {
    try {
      const textToCopy = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy(data, path);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getValueType = (val: any): string => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'string': return <Type className="h-3 w-3" />;
      case 'number': return <Hash className="h-3 w-3" />;
      case 'boolean': return <Eye className="h-3 w-3" />;
      case 'array': return <FileText className="h-3 w-3" />;
      case 'object': return <FileText className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getValueColor = (type: string): string => {
    switch (type) {
      case 'string': return 'text-emerald-400';
      case 'number': return 'text-blue-400';
      case 'boolean': return 'text-amber-400';
      case 'null': return 'text-gray-500';
      default: return 'text-gray-300';
    }
  };

  const highlightSearchTerm = (text: string, term: string): React.ReactNode => {
    if (!term || !text.includes(term)) return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => (
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    ));
  };

  const isExpandable = (val: any) => {
    return val !== null && (typeof val === 'object' || Array.isArray(val));
  };

  const renderValue = (val: any, type: string) => {
    if (type === 'string') {
      return `"${highlightSearchTerm(val, searchTerm)}"`;
    }
    if (type === 'null') {
      return 'null';
    }
    return String(val);
  };

  const valueType = getValueType(value);
  const isArr = valueType === 'array';
  const expandable = isExpandable(value);

  return (
    <motion.div
      className="font-mono text-sm"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: level * 0.05 }}
    >
      <div className="flex items-center group hover:bg-white/5 rounded px-2 py-1 transition-colors duration-200">
        {/* Indentation */}
        <div style={{ width: `${level * 20}px` }} />
        
        {/* Expand/Collapse Button */}
        {expandable ? (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 p-1 rounded hover:bg-white/10 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </motion.div>
          </motion.button>
        ) : (
          <div className="w-6" />
        )}

        {/* Type Icon */}
        <div className={`mr-2 ${getValueColor(valueType)}`}>
          {getTypeIcon(valueType)}
        </div>

        {/* Key Name */}
        {keyName !== undefined && (
          <span className="text-blue-300 mr-2">
            {highlightSearchTerm(String(keyName), searchTerm)}:
          </span>
        )}

        {/* Value Preview */}
        <span className={`flex-1 ${getValueColor(valueType)}`}>
          {expandable ? (
            <span className="text-gray-400">
              {isArr ? `Array(${value.length})` : `Object(${Object.keys(value).length})`}
              {isExpanded && (isArr ? ' [' : ' {')}
            </span>
          ) : (
            renderValue(value, valueType)
          )}
        </span>

        {/* Copy Button */}
        <motion.button
          onClick={() => handleCopy(value)}
          className="ml-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-green-400"
              >
                <CheckCircle className="h-3 w-3" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-gray-400"
              >
                <Copy className="h-3 w-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Expanded Children */}
      <AnimatePresence>
        {expandable && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {isArr ? (
              value.map((item: any, index: number) => (
                <JSONNode
                  key={index}
                  value={item}
                  keyName={index}
                  level={level + 1}
                  path={`${path}[${index}]`}
                  searchTerm={searchTerm}
                  onCopy={onCopy}
                />
              ))
            ) : (
              Object.entries(value).map(([key, val]) => (
                <JSONNode
                  key={key}
                  value={val}
                  keyName={key}
                  level={level + 1}
                  path={path ? `${path}.${key}` : key}
                  searchTerm={searchTerm}
                  onCopy={onCopy}
                />
              ))
            )}
            {isExpanded && (
              <div className="flex items-center text-gray-400 text-sm">
                <div style={{ width: `${level * 20}px` }} />
                <span>{isArr ? ']' : '}'}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const JSONTreeViewer: React.FC<JSONTreeViewerProps> = ({ 
  data, 
  className = '', 
  maxHeight = '500px' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const parsedData = useMemo(() => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return { error: 'Invalid JSON', raw: data };
      }
    }
    return data;
  }, [data]);

  const handleCopy = (_value: any, path: string) => {
    setCopyMessage(`Copied ${path || 'value'} to clipboard`);
    setTimeout(() => setCopyMessage(''), 3000);
  };

  return (
    <motion.div
      className={`glass-card relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 glass-surface">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-400" />
          <span className="font-display font-medium text-gray-900 dark:text-white">
            JSON Response
          </span>
        </div>
        
        <motion.button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="h-4 w-4 text-gray-400" />
        </motion.button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-gray-200 dark:border-gray-700"
          >
            <div className="p-3">
              <input
                type="text"
                placeholder="Search in JSON..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-gray-300 dark:border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Message */}
      <AnimatePresence>
        {copyMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 bg-green-600 text-white px-3 py-1 rounded-md text-sm z-10"
          >
            {copyMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* JSON Tree */}
      <div 
        className="p-4 overflow-auto bg-gradient-to-br from-gray-900/90 to-black/90"
        style={{ maxHeight }}
      >
        <JSONNode
          value={parsedData}
          level={0}
          path=""
          searchTerm={searchTerm}
          onCopy={handleCopy}
        />
      </div>
    </motion.div>
  );
};

export default JSONTreeViewer;
