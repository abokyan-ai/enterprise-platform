/**
 * @file app.component.ts
 * @module apps/studio
 *
 * Root component for the Angular Studio presentation shell.
 * Connects to the backend Platform Info endpoint and displays
 * platform architecture, runtime status, and bootstrap health.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformInfoService, type PlatformInfoState } from './services/platform-info.service.js';
import { getFrontendConfig } from './config/frontend-config.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="studio-layout">
      <header class="studio-header">
        <div class="header-brand">
          <div class="brand-logo">MDE</div>
          <div class="brand-text">
            <h1>Model-Driven Enterprise Ecosystem</h1>
            <span class="brand-subtitle">Studio Presentation Shell &bull; ARC-04 Bootstrap</span>
          </div>
        </div>
        <div class="header-meta">
          <span class="badge" [class.badge-dev]="config.environment === 'development'">
            {{ config.environment | uppercase }}
          </span>
          <span class="version-label">v{{ config.version }}</span>
        </div>
      </header>

      <main class="studio-content">
        <!-- Connectivity Banner -->
        <section class="card connectivity-card">
          <div class="card-header">
            <h2>Backend Host Connectivity</h2>
            <button class="btn btn-secondary" (click)="checkConnectivity()" [disabled]="state.loading">
              {{ state.loading ? 'Checking...' : 'Refresh Status' }}
            </button>
          </div>

          <div *ngIf="state.loading" class="state-indicator loading">
            <div class="spinner"></div>
            <span>Checking communication with backend host ({{ config.apiBaseUrl }}/platform/info)...</span>
          </div>

          <div *ngIf="!state.loading && state.data" class="state-indicator connected">
            <div class="status-badge live">LIVE</div>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Platform Name</span>
                <span class="value">{{ state.data.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Host Status</span>
                <span class="value uppercase">{{ state.data.status }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Backend Version</span>
                <span class="value">{{ state.data.version }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Environment</span>
                <span class="value">{{ state.data.environment }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Uptime</span>
                <span class="value">{{ state.data.uptimeSeconds | number:'1.1-1' }}s</span>
              </div>
              <div class="detail-item">
                <span class="label">Timestamp</span>
                <span class="value">{{ state.data.timestamp }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="!state.loading && state.error" class="state-indicator disconnected">
            <div class="status-badge offline">OFFLINE / UNREACHABLE</div>
            <div class="error-details">
              <p class="error-message">{{ state.error }}</p>
              <p class="error-hint">
                To connect the backend, run: <code>npx nx serve api</code> or start NestJS on port 3000.
                The frontend operates with decoupled resilience when the backend is offline.
              </p>
            </div>
          </div>
        </section>

        <!-- Architecture Layers Matrix -->
        <section class="card architecture-card">
          <div class="card-header">
            <h2>Platform Architectural Topology (ARC-01 to ARC-04)</h2>
            <span class="status-badge verified">CONSTITUTION VERIFIED</span>
          </div>

          <div class="layers-grid">
            <div class="layer-item">
              <div class="layer-tag">apps/studio</div>
              <h3>Presentation Adapter (Frontend)</h3>
              <p>Angular 19 Standalone host consuming @ecosystem/platform-contracts via HTTP. Zero direct kernel access.</p>
              <span class="isolation-badge">Isolation: Frontend Sandbox</span>
            </div>

            <div class="layer-item">
              <div class="layer-tag">apps/api</div>
              <h3>Host Application (Backend)</h3>
              <p>NestJS 12 composition root with strict configuration validation, health checks, and lifecycle hooks.</p>
              <span class="isolation-badge">Isolation: Node.js Host</span>
            </div>

            <div class="layer-item">
              <div class="layer-tag">packages/platform-contracts</div>
              <h3>Platform Contracts</h3>
              <p>Canonical wire contracts, API envelopes, and health structures shared safely across host boundaries.</p>
              <span class="isolation-badge">Purity: Framework-Agnostic</span>
            </div>

            <div class="layer-item">
              <div class="layer-tag">packages/semantic-kernel</div>
              <h3>Semantic Kernel</h3>
              <p>Zero-dependency semantic primitives, URN identities, and facet models. Zero framework dependencies.</p>
              <span class="isolation-badge">Purity: Pure TypeScript</span>
            </div>
          </div>
        </section>
      </main>

      <footer class="studio-footer">
        <span>Model-Driven Enterprise Ecosystem Platform &bull; Architecture Milestone VS-00 / ARC-04</span>
        <span class="footer-links">Strict Clean-Core &bull; Zero Direct Framework Coupling in Core</span>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .studio-layout {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .studio-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #1e293b;
      border-radius: 12px;
      border: 1px solid #334155;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: 1px;
    }

    .brand-text h1 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
    }

    .brand-subtitle {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-dev {
      background: #0369a1;
      color: #e0f2fe;
    }

    .version-label {
      font-size: 0.85rem;
      color: #64748b;
    }

    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 24px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background 0.15s ease;
    }

    .btn-secondary {
      background: #334155;
      color: #f1f5f9;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #475569;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .state-indicator {
      padding: 20px;
      border-radius: 8px;
    }

    .state-indicator.loading {
      background: #0f172a;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #94a3b8;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #334155;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .state-indicator.connected {
      background: #064e3b22;
      border: 1px solid #059669;
    }

    .state-indicator.disconnected {
      background: #7f1d1d22;
      border: 1px solid #dc2626;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .status-badge.live {
      background: #059669;
      color: #ecfdf5;
    }

    .status-badge.offline {
      background: #dc2626;
      color: #fef2f2;
    }

    .status-badge.verified {
      background: #2563eb;
      color: #eff6ff;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item .label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item .value {
      font-size: 0.95rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .uppercase {
      text-transform: uppercase;
    }

    .error-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .error-message {
      margin: 0;
      color: #fca5a5;
      font-weight: 600;
    }

    .error-hint {
      margin: 0;
      color: #94a3b8;
      font-size: 0.85rem;
    }

    .error-hint code {
      background: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      color: #38bdf8;
      font-family: monospace;
    }

    .layers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .layer-item {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .layer-tag {
      font-size: 0.75rem;
      font-family: monospace;
      color: #38bdf8;
    }

    .layer-item h3 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #f1f5f9;
    }

    .layer-item p {
      margin: 0;
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.4;
      flex-grow: 1;
    }

    .isolation-badge {
      font-size: 0.7rem;
      color: #a78bfa;
      font-weight: 500;
    }

    .studio-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-top: 1px solid #334155;
      font-size: 0.75rem;
      color: #64748b;
    }
  `],
})
export class AppComponent implements OnInit {
  private readonly platformInfoService = inject(PlatformInfoService);
  public readonly config = getFrontendConfig();

  public state: PlatformInfoState = {
    loading: true,
    data: null,
    error: null,
  };

  public ngOnInit(): void {
    this.checkConnectivity();
  }

  public checkConnectivity(): void {
    this.state = { loading: true, data: null, error: null };
    this.platformInfoService.fetchPlatformInfo().subscribe({
      next: (result) => {
        this.state = result;
      },
      error: (err) => {
        this.state = {
          loading: false,
          data: null,
          error: `Unexpected error: ${String(err)}`,
        };
      },
    });
  }
}
