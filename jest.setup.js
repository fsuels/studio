import '@testing-library/jest-dom';
import React from 'react';
// Ensure React is available in tests that reference it directly
// Some mocks call React.forwardRef without importing React
globalThis.React = React;
import { configureAxe } from 'jest-axe';

// Configure axe for jest
const axe = configureAxe({
  rules: {
    // Customize axe rules for your specific needs
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    keyboard: { enabled: true },
    wcag2aa: { enabled: true },
  },
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useParams() {
    return {
      locale: 'en',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react
jest.mock('lucide-react', () => {
  const MockIcon = ({ children, ...props }) => <div data-testid="mock-icon" {...props}>{children}</div>;
  
  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return MockIcon;
      }
      return target[prop];
    }
  });
});

// Mock @radix-ui components
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }) => <div data-testid="dialog-root">{children}</div>,
  Trigger: ({ children, ...props }) => <button data-testid="dialog-trigger" {...props}>{children}</button>,
  Content: ({ children, ...props }) => <div data-testid="dialog-content" {...props}>{children}</div>,
  Header: ({ children, ...props }) => <div data-testid="dialog-header" {...props}>{children}</div>,
  Title: ({ children, ...props }) => <h2 data-testid="dialog-title" {...props}>{children}</h2>,
  Description: ({ children, ...props }) => <p data-testid="dialog-description" {...props}>{children}</p>,
  Close: ({ children, ...props }) => <button data-testid="dialog-close" {...props}>{children}</button>,
  Overlay: ({ children, ...props }) => <div data-testid="dialog-overlay" {...props}>{children}</div>,
}));

jest.mock('@radix-ui/react-checkbox', () => ({
  Root: ({ checked, onCheckedChange, ...props }) => (
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange?.(e.target.checked)} 
      {...props} 
    />
  ),
  Indicator: ({ children }) => <span>{children}</span>,
}));

jest.mock('@radix-ui/react-slider', () => ({
  Root: ({ value, onValueChange, min, max, step, ...props }) => (
    <input
      type="range"
      value={value?.[0] || 0}
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  ),
  Track: ({ children }) => <div>{children}</div>,
  Range: () => <div />,
  Thumb: () => <div />,
}));


jest.mock('@radix-ui/react-select', () => {
  const Root = ({ children, ...props }) => <div data-testid="select-root" {...props}>{children}</div>;
  const Trigger = ({ children, ...props }) => <button data-testid="select-trigger" {...props}>{children}</button>;
  const Content = ({ children, ...props }) => <div data-testid="select-content" {...props}>{children}</div>;
  const Item = ({ children, ...props }) => <div data-testid="select-item" {...props}>{children}</div>;
  const Value = ({ children, ...props }) => <span data-testid="select-value" {...props}>{children}</span>;
  const Viewport = ({ children, ...props }) => <div data-testid="select-viewport" {...props}>{children}</div>;
  const ScrollUpButton = ({ children, ...props }) => <button data-testid="select-scroll-up" {...props}>{children}</button>;
  const ScrollDownButton = ({ children, ...props }) => <button data-testid="select-scroll-down" {...props}>{children}</button>;
  const Label = ({ children, ...props }) => <label data-testid="select-label" {...props}>{children}</label>;
  Label.displayName = 'SelectLabel';
  return { Root, Trigger, Content, Item, Value, Viewport, ScrollUpButton, ScrollDownButton, Label };
});

// Mock tooltip to avoid provider dependency
jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }) => <>{children}</>,
  Root: ({ children }) => <div data-testid="tooltip-root">{children}</div>,
  Trigger: ({ children, ...props }) => <button data-testid="tooltip-trigger" {...props}>{children}</button>,
  Content: ({ children, ...props }) => <div data-testid="tooltip-content" {...props}>{children}</div>,
}));

// Mock embla-carousel
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    { current: { scrollTo: jest.fn(), scrollNext: jest.fn(), scrollPrev: jest.fn() } },
    { current: null }
  ],
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => options?.defaultValue || key,
  }),
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
}));

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock NextResponse
const createMockResponse = (status = 200, headers = {}) => {
  const responseHeaders = new Headers(headers);
  return {
    status,
    headers: responseHeaders,
  };
};

jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url, init) {
      this._url = typeof url === 'string' ? new URL(url) : url;
      this._method = init?.method || 'GET';
      this._headers = new Headers(init?.headers || {});
      this._body = init?.body;
      this.nextUrl = new URL(this._url);
    }

    get url() {
      return this._url.toString();
    }
    get method() {
      return this._method;
    }
    get headers() {
      return this._headers;
    }
    get body() {
      return this._body;
    }

    async json() {
      return JSON.parse(this._body);
    }
  },
  NextResponse: {
    json: (data, init) => {
      const response = new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init?.headers || {}),
        },
      });
      response.json = async () => data;
      return response;
    },
    error: () => {
      const response = new Response(null, { status: 500 });
      response.json = async () => ({ error: 'Internal Server Error' });
      return response;
    },
    next: () => createMockResponse(200),
    redirect: (url, init = {}) => {
      const status = typeof init === 'number' ? init : init.status || 307;
      const response = createMockResponse(status);
      response.headers.set('location', url.toString());
      return response;
    },
    rewrite: (url) => {
      const response = createMockResponse(200);
      response.headers.set('x-middleware-rewrite', url.toString());
      return response;
    },
  },
}));

// Mock Web APIs that are not available in Node.js test environment
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init) {
      this._url = input;
      this._method = init?.method || 'GET';
      this._headers = new Map(Object.entries(init?.headers || {}));
      this._body = init?.body;
    }

    get url() {
      return this._url;
    }
    get method() {
      return this._method;
    }
    get headers() {
      return this._headers;
    }
    get body() {
      return this._body;
    }
  };
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init) {
      this._body = body;
      this._status = init?.status || 200;
      this._statusText = init?.statusText || 'OK';
      this._headers = new Map(Object.entries(init?.headers || {}));
    }

    get body() {
      return this._body;
    }
    get status() {
      return this._status;
    }
    get statusText() {
      return this._statusText;
    }
    get headers() {
      return this._headers;
    }

    json() {
      return Promise.resolve(JSON.parse(this._body));
    }

    text() {
      return Promise.resolve(this._body);
    }
  };
}