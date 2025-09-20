import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import type { Resolver } from 'react-hook-form';

declare module '@hookform/resolvers/zod' {
  export function zodResolver<TSchema extends ZodTypeAny>(
    schema: TSchema,
    schemaOptions?: unknown,
    resolverOptions?: unknown
  ): Resolver<ZodInfer<TSchema>, Record<string, unknown>>;
}
