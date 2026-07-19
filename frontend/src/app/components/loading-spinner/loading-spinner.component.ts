import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrapper">
      <div class="beaker">
        <div class="liquid">
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
        </div>
      </div>
      <p class="loading-text">Loading...</p>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1.5rem;
    }

    .beaker {
      width: 50px;
      height: 60px;
      border: 3px solid var(--accent-secondary);
      border-top: none;
      border-radius: 0 0 10px 10px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        height: 3px;
        background: var(--accent-secondary);
        border-radius: 2px;
      }
    }

    .liquid {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(180deg, rgba(0, 212, 255, 0.3), rgba(0, 255, 136, 0.4));
      border-radius: 0 0 7px 7px;
      animation: liquidWave 2s ease-in-out infinite;
    }

    .bubble {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(0, 255, 136, 0.6);
      animation: bubbleRise 2s ease-in infinite;

      &:nth-child(1) { left: 20%; animation-delay: 0s; }
      &:nth-child(2) { left: 50%; animation-delay: 0.5s; width: 4px; height: 4px; }
      &:nth-child(3) { left: 75%; animation-delay: 1s; width: 5px; height: 5px; }
    }

    @keyframes liquidWave {
      0%, 100% { height: 60%; }
      50% { height: 65%; }
    }

    @keyframes bubbleRise {
      0% { bottom: 0; opacity: 0; transform: scale(0); }
      20% { opacity: 0.8; transform: scale(1); }
      100% { bottom: 100%; opacity: 0; transform: scale(0.5); }
    }

    .loading-text {
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
  `]
})
export class LoadingSpinnerComponent {}
