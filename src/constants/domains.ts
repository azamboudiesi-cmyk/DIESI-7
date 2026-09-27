import { TechnicalDomain } from '../types';

export interface DomainMeta {
  id: TechnicalDomain;
  name: string;
  description: string;
  iconName: string; // lucide icon identifier
  color: string;
  badgeBg: string;
  popularTopics: string[];
}

export const TECHNICAL_DOMAINS: DomainMeta[] = [
  {
    id: 'Développement Web',
    name: 'Développement Web',
    description: 'HTML5, CSS3, DOM, Responsive design, REST API, Web Performance & Accessibilité',
    iconName: 'Globe',
    color: 'text-blue-500',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    popularTopics: ['DOM & Events', 'CSS Grid/Flexbox', 'Web APIs', 'Performance', 'Accessibilité (a11y)'],
  },
  {
    id: 'JavaScript',
    name: 'JavaScript',
    description: 'ES6+, closures, prototypes, event loop, promesses, async/await, gestion de la mémoire',
    iconName: 'Code',
    color: 'text-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    popularTopics: ['Event Loop & Microtasks', 'Closures & Scopes', 'Promises & Async/Await', 'Prototypes', 'Types & Coercion'],
  },
  {
    id: 'Python',
    name: 'Python',
    description: 'Structures de données, OOP, générateurs, décorateurs, typage, écosystème & bibliothèques',
    iconName: 'Terminal',
    color: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    popularTopics: ['Decorators & Generators', 'Data Structures (dict, set)', 'OOP & Metaclasses', 'GIL & Concurrency', 'Type Hinting'],
  },
  {
    id: 'Java',
    name: 'Java',
    description: 'JVM, POO stricte, multithreading, collections framework, memory management & Streams',
    iconName: 'Coffee',
    color: 'text-orange-500',
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    popularTopics: ['JVM & Garbage Collection', 'Multithreading & Concurrency', 'Java Collections', 'Streams API', 'Design Patterns'],
  },
  {
    id: 'C/C++',
    name: 'C/C++',
    description: 'Gestion manuelle de la mémoire, pointeurs, RAII, STL, templates, architecture bas niveau',
    iconName: 'Cpu',
    color: 'text-cyan-500',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    popularTopics: ['Pointers & Memory Allocation', 'RAII & Smart Pointers', 'STL Containers', 'Templates', 'Virtual Tables'],
  },
  {
    id: 'Bases de données',
    name: 'Bases de données',
    description: 'SQL, modélisation relationnelle, indexation, transactions ACID, normalisation, NoSQL',
    iconName: 'Database',
    color: 'text-indigo-500',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    popularTopics: ['Index B-Tree & Explain', 'Transactions & ACID', 'Jointures & Optimisation', 'Normalisation (3NF)', 'Sharding & Replication'],
  },
  {
    id: 'Réseaux',
    name: 'Réseaux',
    description: 'Modèle OSI, TCP/IP, DNS, HTTP/HTTPS, WebSockets, routage, sous-réseaux et protocoles',
    iconName: 'Network',
    color: 'text-purple-500',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    popularTopics: ['Modèle OSI vs TCP/IP', 'Handshake TCP & TLS', 'DNS Resolution', 'HTTP/2 & HTTP/3', 'Subnetting & Routing'],
  },
  {
    id: 'Cybersécurité',
    name: 'Cybersécurité',
    description: 'OWASP Top 10, chiffrement symétrique/asymétrique, failles XSS, CSRF, injections SQL, auth & IAM',
    iconName: 'ShieldCheck',
    color: 'text-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    popularTopics: ['OWASP Top 10 (XSS, CSRF)', 'SQL Injection & Prepared Statements', 'Cryptographie & Hashing', 'JWT Security', 'CORS & CSP'],
  },
  {
    id: 'Algorithmique',
    name: 'Algorithmique',
    description: 'Complexité Big-O, recherche, tri, arbres, graphes, programmation dynamique, récursivité',
    iconName: 'Binary',
    color: 'text-teal-500',
    badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    popularTopics: ['Complexité temporelle & spatiale O(n)', 'Parcours d\'arbres (DFS, BFS)', 'Programmation Dynamique', 'Deux Pointeurs / Sliding Window', 'Algorithmes de Tri'],
  },
];
