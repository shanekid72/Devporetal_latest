import React from 'react';
import { 
  BashIcon, 
  JavaScriptIcon, 
  TypeScriptIcon, 
  PythonIcon, 
  PHPIcon, 
  JavaIcon, 
  CSharpIcon, 
  RubyIcon, 
  GoIcon, 
  SwiftIcon, 
  KotlinIcon,
  CIcon,
  CppIcon,
  DefaultIcon 
} from '../components/LanguageIcons';

interface LanguageConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  extension: string;
}

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  bash: {
    key: 'bash',
    label: 'Shell',
    icon: BashIcon,
    color: '#4EAA25',
    extension: 'sh'
  },
  javascript: {
    key: 'javascript',
    label: 'JavaScript',
    icon: JavaScriptIcon,
    color: '#F7DF1E',
    extension: 'js'
  },
  typescript: {
    key: 'typescript',
    label: 'TypeScript',
    icon: TypeScriptIcon,
    color: '#3178C6',
    extension: 'ts'
  },
  python: {
    key: 'python',
    label: 'Python',
    icon: PythonIcon,
    color: '#3776AB',
    extension: 'py'
  },
  php: {
    key: 'php',
    label: 'PHP',
    icon: PHPIcon,
    color: '#777BB4',
    extension: 'php'
  },
  ruby: {
    key: 'ruby',
    label: 'Ruby',
    icon: RubyIcon,
    color: '#CC342D',
    extension: 'rb'
  },
  java: {
    key: 'java',
    label: 'Java',
    icon: JavaIcon,
    color: '#ED8B00',
    extension: 'java'
  },
  kotlin: {
    key: 'kotlin',
    label: 'Kotlin',
    icon: KotlinIcon,
    color: '#7F52FF',
    extension: 'kt'
  },
  swift: {
    key: 'swift',
    label: 'Swift',
    icon: SwiftIcon,
    color: '#FA7343',
    extension: 'swift'
  },
  csharp: {
    key: 'csharp',
    label: 'C#',
    icon: CSharpIcon,
    color: '#239120',
    extension: 'cs'
  },
  cpp: {
    key: 'cpp',
    label: 'C++',
    icon: CppIcon,
    color: '#00599C',
    extension: 'cpp'
  },
  c: {
    key: 'c',
    label: 'C',
    icon: CIcon,
    color: '#A8B9CC',
    extension: 'c'
  },
  go: {
    key: 'go',
    label: 'Go',
    icon: GoIcon,
    color: '#00ADD8',
    extension: 'go'
  }
};

export const getLanguageConfig = (languageKey: string): LanguageConfig => {
  return LANGUAGE_CONFIGS[languageKey] || {
    key: languageKey,
    label: languageKey.charAt(0).toUpperCase() + languageKey.slice(1),
    icon: DefaultIcon,
    color: '#6B7280',
    extension: 'txt'
  };
};

export const getAllLanguages = (): LanguageConfig[] => {
  return Object.values(LANGUAGE_CONFIGS);
};
