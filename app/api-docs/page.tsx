'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">E-Bookstore OpenAPI Documentation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Standard OpenAPI 3.0 specification for backend services and AI test case generation.
          </p>
        </div>
        <a
          href="/openapi.json"
          target="_blank"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          Download JSON Spec
        </a>
      </div>
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <SwaggerUI url="/openapi.json" />
      </div>
    </div>
  );
}
