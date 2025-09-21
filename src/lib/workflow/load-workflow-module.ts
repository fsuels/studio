// Utility to lazily load the heavy document workflow module only when needed
// to keep client bundles small.
let workflowModulePromise:
  | Promise<typeof import('./document-workflow')>
  | null = null;

export function loadWorkflowModule() {
  if (!workflowModulePromise) {
    workflowModulePromise = import('./document-workflow');
  }
  return workflowModulePromise;
}
