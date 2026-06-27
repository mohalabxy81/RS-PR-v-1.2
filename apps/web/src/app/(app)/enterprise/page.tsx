'use client';

import React, { useState } from 'react';
import { GovernanceCenter } from '@/components/enterprise/GovernanceCenter';
import { WorkflowBuilder } from '@/components/enterprise/WorkflowBuilder';
import { Shield, GitMerge, FileCheck, Building2, Server } from 'lucide-react';

export default function EnterpriseDashboardPage() {
  const [activeTab, setActiveTab] = useState('governance');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Enterprise Administration</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 flex flex-col space-y-1">
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'governance' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('governance')}
          >
            <Shield className="h-4 w-4" />
            <span>Governance & Policies</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'workflow' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('workflow')}
          >
            <GitMerge className="h-4 w-4" />
            <span>Workflow Engine</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'compliance' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('compliance')}
          >
            <FileCheck className="h-4 w-4" />
            <span>Compliance Center</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'organization' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('organization')}
          >
            <Building2 className="h-4 w-4" />
            <span>Organization Hierarchy</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'integrations' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('integrations')}
          >
            <Server className="h-4 w-4" />
            <span>Enterprise Integrations</span>
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'governance' && <GovernanceCenter />}
          {activeTab === 'workflow' && <WorkflowBuilder />}
          {activeTab === 'compliance' && (
            <div className="p-6 bg-card rounded-xl border">
              <h3 className="text-xl font-bold mb-4">Compliance & Data Retention</h3>
              <p className="text-muted-foreground mb-4">Configure legal holds, audit exports, and data retention rules.</p>
              <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/20">
                <p className="font-medium text-muted-foreground">Compliance Center module is currently provisioning.</p>
              </div>
            </div>
          )}
          {activeTab === 'organization' && (
            <div className="p-6 bg-card rounded-xl border">
              <h3 className="text-xl font-bold mb-4">Organization Hierarchy</h3>
              <p className="text-muted-foreground mb-4">Manage holding companies, subsidiaries, and departments.</p>
              <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/20">
                <p className="font-medium text-muted-foreground">Hierarchy module is currently provisioning.</p>
              </div>
            </div>
          )}
          {activeTab === 'integrations' && (
            <div className="p-6 bg-card rounded-xl border">
              <h3 className="text-xl font-bold mb-4">Enterprise Integrations</h3>
              <p className="text-muted-foreground mb-4">Configure SSO (SAML/OIDC), ERP connectors, and HR sync.</p>
              <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/20">
                <p className="font-medium text-muted-foreground">Integration module is currently provisioning.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
