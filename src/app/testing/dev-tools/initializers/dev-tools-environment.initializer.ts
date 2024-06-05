import { inject } from '@angular/core';
import { DevToolsEnvManagerService } from '@testing/dev-tools/services/dev-tools-env-manager.service';

export function devToolsEnvironmentInitializer() {
  const devToolsEnv = inject(DevToolsEnvManagerService);

  return (): boolean => {
    /**
     * Here I override environment settings, applying configuration which has been set using App DevTools.
     */
    devToolsEnv.applySettingsToEnvironment(devToolsEnv.settings());

    return true;
  };
}
