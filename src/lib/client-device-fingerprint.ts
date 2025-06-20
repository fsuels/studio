// Client-side Device Fingerprinting
// Collects device characteristics for fraud detection
'use client';

export interface DeviceFingerprintData {
  userAgent: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  canvas?: string;
  webgl?: string;
  fonts?: string[];
  plugins?: string[];
  touch: boolean;
  hardware: {
    cpuCores: number;
    memory?: number;
  };
  network: {
    connectionType?: string;
    downlink?: number;
  };
  battery?: {
    charging: boolean;
    level: number;
  };
  permissions: {
    notifications?: string;
    geolocation?: string;
  };
}

class DeviceFingerprintCollector {
  private cache: DeviceFingerprintData | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async collect(options: {
    includeCanvas?: boolean;
    includeWebGL?: boolean;
    includeFonts?: boolean;
    includePermissions?: boolean;
    timeout?: number;
  } = {}): Promise<DeviceFingerprintData> {
    const {
      includeCanvas = true,
      includeWebGL = true,
      includeFonts = false, // Expensive operation
      includePermissions = false, // May prompt user
      timeout = 3000
    } = options;

    // Return cached result if still valid
    if (this.cache && Date.now() < this.cacheExpiry) {
      return this.cache;
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(this.getBasicFingerprint());
      }, timeout);

      Promise.all([
        this.getBasicData(),
        includeCanvas ? this.getCanvasFingerprint() : Promise.resolve(undefined),
        includeWebGL ? this.getWebGLFingerprint() : Promise.resolve(undefined),
        includeFonts ? this.getFontList() : Promise.resolve(undefined),
        this.getHardwareInfo(),
        this.getNetworkInfo(),
        this.getBatteryInfo(),
        includePermissions ? this.getPermissions() : Promise.resolve({})
      ]).then(([
        basic,
        canvas,
        webgl,
        fonts,
        hardware,
        network,
        battery,
        permissions
      ]) => {
        clearTimeout(timeoutId);

        const fingerprint: DeviceFingerprintData = {
          ...basic,
          ...(canvas && { canvas }),
          ...(webgl && { webgl }),
          ...(fonts && { fonts }),
          hardware,
          network,
          ...(battery && { battery }),
          permissions
        };

        // Cache the result
        this.cache = fingerprint;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;

        resolve(fingerprint);
      }).catch(() => {
        clearTimeout(timeoutId);
        resolve(this.getBasicFingerprint());
      });
    });
  }

  private getBasicData(): DeviceFingerprintData {
    return {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: this.testStorage('localStorage'),
      sessionStorage: this.testStorage('sessionStorage'),
      touch: 'ontouchstart' in window,
      hardware: { cpuCores: navigator.hardwareConcurrency || 1 },
      network: {},
      permissions: {}
    };
  }

  private getBasicFingerprint(): DeviceFingerprintData {
    try {
      return this.getBasicData();
    } catch (error) {
      return {
        userAgent: 'unknown',
        screen: { width: 0, height: 0, colorDepth: 0, pixelRatio: 1 },
        timezone: 'unknown',
        language: 'unknown',
        platform: 'unknown',
        cookiesEnabled: false,
        localStorage: false,
        sessionStorage: false,
        touch: false,
        hardware: { cpuCores: 1 },
        network: {},
        permissions: {}
      };
    }
  }

  private async getCanvasFingerprint(): Promise<string> {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve('');
          return;
        }

        canvas.width = 200;
        canvas.height = 50;

        // Draw various shapes and text
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        
        ctx.fillStyle = '#069';
        ctx.fillText('Device fingerprint 🔒', 2, 15);
        
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Canvas fingerprint', 4, 35);
        
        // Add some geometric shapes
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgb(255,0,255)';
        ctx.beginPath();
        ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        // Get the canvas data as a hash
        const imageData = canvas.toDataURL();
        resolve(this.simpleHash(imageData).slice(-32)); // Last 32 chars
      } catch (error) {
        resolve('');
      }
    });
  }

  private async getWebGLFingerprint(): Promise<string> {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          resolve('');
          return;
        }

        // Get WebGL parameters
        const vendor = gl.getParameter(gl.VENDOR);
        const renderer = gl.getParameter(gl.RENDERER);
        const version = gl.getParameter(gl.VERSION);
        const shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        
        // Get supported extensions
        const extensions = gl.getSupportedExtensions() || [];
        
        const webglInfo = [
          vendor,
          renderer,
          version,
          shadingLanguageVersion,
          extensions.slice(0, 10).join(',') // Limit to first 10 extensions
        ].join('|');

        resolve(this.simpleHash(webglInfo).slice(-32));
      } catch (error) {
        resolve('');
      }
    });
  }

  private async getFontList(): Promise<string[]> {
    return new Promise((resolve) => {
      const baseFonts = ['monospace', 'sans-serif', 'serif'];
      const testFonts = [
        'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Comic Sans MS',
        'Consolas', 'Courier New', 'Georgia', 'Helvetica', 'Impact',
        'Lucida Console', 'Lucida Sans Unicode', 'Palatino Linotype',
        'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
      ];

      const availableFonts: string[] = [];
      
      // Create a test element
      const testElement = document.createElement('span');
      testElement.style.fontSize = '72px';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.top = '-9999px';
      testElement.textContent = 'mmmmmmmmmmlli';
      document.body.appendChild(testElement);

      try {
        // Test each font
        for (const font of testFonts) {
          let detected = false;
          
          for (const baseFont of baseFonts) {
            testElement.style.fontFamily = `${font}, ${baseFont}`;
            const width1 = testElement.offsetWidth;
            
            testElement.style.fontFamily = baseFont;
            const width2 = testElement.offsetWidth;
            
            if (width1 !== width2) {
              detected = true;
              break;
            }
          }
          
          if (detected) {
            availableFonts.push(font);
          }
        }
      } catch (error) {
        // Ignore errors
      } finally {
        document.body.removeChild(testElement);
      }

      resolve(availableFonts);
    });
  }

  private async getHardwareInfo(): Promise<DeviceFingerprintData['hardware']> {
    const hardware: DeviceFingerprintData['hardware'] = {
      cpuCores: navigator.hardwareConcurrency || 1
    };

    // Try to get memory info (Chrome only)
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      hardware.memory = Math.round(memory.jsHeapSizeLimit / 1024 / 1024); // MB
    }

    return hardware;
  }

  private async getNetworkInfo(): Promise<DeviceFingerprintData['network']> {
    const network: DeviceFingerprintData['network'] = {};

    // Network Information API (limited support)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        network.connectionType = connection.effectiveType;
        network.downlink = connection.downlink;
      }
    }

    return network;
  }

  private async getBatteryInfo(): Promise<DeviceFingerprintData['battery'] | undefined> {
    try {
      // Battery API (deprecated but still works in some browsers)
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        return {
          charging: battery.charging,
          level: Math.round(battery.level * 100) / 100
        };
      }
    } catch (error) {
      // Ignore errors
    }
    return undefined;
  }

  private async getPermissions(): Promise<DeviceFingerprintData['permissions']> {
    const permissions: DeviceFingerprintData['permissions'] = {};

    if ('permissions' in navigator) {
      try {
        const notifications = await navigator.permissions.query({ name: 'notifications' as any });
        permissions.notifications = notifications.state;
      } catch (error) {
        // Ignore errors
      }

      try {
        const geolocation = await navigator.permissions.query({ name: 'geolocation' });
        permissions.geolocation = geolocation.state;
      } catch (error) {
        // Ignore errors
      }
    }

    return permissions;
  }

  private testStorage(storageType: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[storageType];
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Generate a unique fingerprint ID
  generateFingerprintId(data: DeviceFingerprintData): string {
    const components = [
      data.userAgent,
      `${data.screen.width}x${data.screen.height}x${data.screen.colorDepth}`,
      data.timezone,
      data.language,
      data.platform,
      data.cookiesEnabled ? '1' : '0',
      data.localStorage ? '1' : '0',
      data.sessionStorage ? '1' : '0',
      data.canvas || '',
      data.webgl || '',
      (data.fonts || []).sort().join(','),
      data.touch ? '1' : '0',
      data.hardware.cpuCores.toString(),
      data.hardware.memory?.toString() || '',
      data.network.connectionType || '',
      data.battery ? `${data.battery.charging}${data.battery.level}` : ''
    ].join('|');

    return `fp_${this.simpleHash(components)}`;
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache = null;
    this.cacheExpiry = 0;
  }
}

// Singleton instance
export const deviceFingerprint = new DeviceFingerprintCollector();

// Convenience function for easy use
export async function collectDeviceFingerprint(options?: {
  includeCanvas?: boolean;
  includeWebGL?: boolean;
  includeFonts?: boolean;
  includePermissions?: boolean;
  timeout?: number;
}): Promise<{ data: DeviceFingerprintData; id: string }> {
  const data = await deviceFingerprint.collect(options);
  const id = deviceFingerprint.generateFingerprintId(data);
  
  return { data, id };
}

// React hook for device fingerprinting
export function useDeviceFingerprint(options?: {
  includeCanvas?: boolean;
  includeWebGL?: boolean;
  includeFonts?: boolean;
  includePermissions?: boolean;
  timeout?: number;
}) {
  const [fingerprint, setFingerprint] = React.useState<{
    data: DeviceFingerprintData | null;
    id: string | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    id: null,
    loading: true,
    error: null
  });

  React.useEffect(() => {
    let mounted = true;

    collectDeviceFingerprint(options)
      .then(({ data, id }) => {
        if (mounted) {
          setFingerprint({
            data,
            id,
            loading: false,
            error: null
          });
        }
      })
      .catch((error) => {
        if (mounted) {
          setFingerprint({
            data: null,
            id: null,
            loading: false,
            error: error.message
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return fingerprint;
}

// Import React for the hook
import React from 'react';