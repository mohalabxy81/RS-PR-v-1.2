import React, { useState } from 'react';
import { Plus, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export function GovernanceCenter() {
  const [policies, setPolicies] = useState([
    { id: 1, name: 'Mandatory Deal Approval', type: 'WORKFLOW', status: 'ACTIVE', rulesCount: 3 },
    { id: 2, name: 'PII Data Masking', type: 'DATA', status: 'ACTIVE', rulesCount: 5 },
    { id: 3, name: 'Cross-Region Access', type: 'ACCESS', status: 'DRAFT', rulesCount: 1 },
  ]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-xl border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Governance & Policies</h3>
            <p className="text-muted-foreground">Manage enterprise-wide rules for access, data, and compliance.</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </button>
        </div>

        {/* Policies List */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Policy Name</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Rules</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4 font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    {policy.name}
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                      {policy.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{policy.rulesCount} Rules</td>
                  <td className="px-4 py-4">
                    {policy.status === 'ACTIVE' ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-600 font-medium">
                        <AlertTriangle className="w-4 h-4 mr-1" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-primary hover:underline font-medium text-sm">Edit Rules</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
