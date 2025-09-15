// Optimized UI component exports for better tree shaking
// Only export components that are actually used across the application

// Core form components - used frequently
export { Button, type ButtonProps } from './button';
export { Input, type InputProps } from './input';
export { Label } from './label';
export { Textarea } from './textarea';

// Dialog components - used in modals
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from './dialog';

// Form validation components
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

// Navigation components
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// Feedback components
export { Toaster } from './toaster';
export { useToast, toast } from './use-toast';

// Layout components
export { Separator } from './separator';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

// Interactive components (lazy loaded)
export type { SelectProps } from './select';
export type { PopoverProps } from './popover';
export type { TooltipProps } from './tooltip';

// Lazy exports for heavy components
export const Select = () => import('./select').then(m => m.Select);
export const SelectContent = () => import('./select').then(m => m.SelectContent);
export const SelectItem = () => import('./select').then(m => m.SelectItem);
export const SelectTrigger = () => import('./select').then(m => m.SelectTrigger);
export const SelectValue = () => import('./select').then(m => m.SelectValue);

export const Popover = () => import('./popover').then(m => m.Popover);
export const PopoverContent = () => import('./popover').then(m => m.PopoverContent);
export const PopoverTrigger = () => import('./popover').then(m => m.PopoverTrigger);

export const Tooltip = () => import('./tooltip').then(m => m.Tooltip);
export const TooltipContent = () => import('./tooltip').then(m => m.TooltipContent);
export const TooltipProvider = () => import('./tooltip').then(m => m.TooltipProvider);
export const TooltipTrigger = () => import('./tooltip').then(m => m.TooltipTrigger);

// Admin-only components (lazy loaded)
export const Accordion = () => import('./accordion').then(m => m.Accordion);
export const AccordionContent = () => import('./accordion').then(m => m.AccordionContent);
export const AccordionItem = () => import('./accordion').then(m => m.AccordionItem);
export const AccordionTrigger = () => import('./accordion').then(m => m.AccordionTrigger);

export const AlertDialog = () => import('./alert-dialog').then(m => m.AlertDialog);
export const AlertDialogAction = () => import('./alert-dialog').then(m => m.AlertDialogAction);
export const AlertDialogCancel = () => import('./alert-dialog').then(m => m.AlertDialogCancel);
export const AlertDialogContent = () => import('./alert-dialog').then(m => m.AlertDialogContent);
export const AlertDialogDescription = () => import('./alert-dialog').then(m => m.AlertDialogDescription);
export const AlertDialogFooter = () => import('./alert-dialog').then(m => m.AlertDialogFooter);
export const AlertDialogHeader = () => import('./alert-dialog').then(m => m.AlertDialogHeader);
export const AlertDialogTitle = () => import('./alert-dialog').then(m => m.AlertDialogTitle);
export const AlertDialogTrigger = () => import('./alert-dialog').then(m => m.AlertDialogTrigger);

// Dashboard-specific components (lazy loaded)
export const Avatar = () => import('./avatar').then(m => m.Avatar);
export const AvatarFallback = () => import('./avatar').then(m => m.AvatarFallback);
export const AvatarImage = () => import('./avatar').then(m => m.AvatarImage);

export const Badge = () => import('./badge').then(m => m.Badge);
export const Checkbox = () => import('./checkbox').then(m => m.Checkbox);
export const Progress = () => import('./progress').then(m => m.Progress);
export const RadioGroup = () => import('./radio-group').then(m => m.RadioGroup);
export const RadioGroupItem = () => import('./radio-group').then(m => m.RadioGroupItem);
export const Slider = () => import('./slider').then(m => m.Slider);
export const Switch = () => import('./switch').then(m => m.Switch);

// Utility function for dynamic component loading
export const loadUIComponent = async (componentName: string) => {
  switch (componentName) {
    case 'Select':
      return import('./select');
    case 'Popover':
      return import('./popover');
    case 'Tooltip':
      return import('./tooltip');
    case 'Accordion':
      return import('./accordion');
    case 'AlertDialog':
      return import('./alert-dialog');
    case 'Avatar':
      return import('./avatar');
    case 'Badge':
      return import('./badge');
    case 'Checkbox':
      return import('./checkbox');
    case 'Progress':
      return import('./progress');
    case 'RadioGroup':
      return import('./radio-group');
    case 'Slider':
      return import('./slider');
    case 'Switch':
      return import('./switch');
    default:
      throw new Error(`Unknown UI component: ${componentName}`);
  }
};