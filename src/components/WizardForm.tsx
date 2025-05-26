// src/components/WizardForm.tsx
"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  FormProvider,
  Controller,
  useFormContext,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link"; // Added Link
import { z } from "zod";
import { Loader2, Info } from "lucide-react";

import type { LegalDocument } from "@/lib/document-library";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

import FieldRenderer from "./FieldRenderer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { prettify } from "@/lib/schema-utils";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import AddressField from "@/components/AddressField";
import { TooltipProvider } from "@/components/ui/tooltip";
import TrustBadges from "@/components/TrustBadges";
import ReviewStep from "@/components/ReviewStep";
import {
  saveFormProgress,
  loadFormProgress,
} from "@/lib/firestore/saveFormProgress";
import { debounce } from "lodash-es";

interface WizardFormProps {
  locale: "en" | "es";
  doc: LegalDocument;
  onComplete: (checkoutUrl: string) => void;
}

export default function WizardForm({
  locale,
  doc,
  onComplete,
}: WizardFormProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  // Params not directly used here but kept if needed for other logic based on original structure.
  // const params = useParams();
  const { toast } = useToast();
  const { isLoggedIn, isLoading: authIsLoading, user } = useAuth();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const liveRef = useRef<HTMLDivElement>(null);

  const {
    getValues,
    trigger,
    control,
    watch,
    setValue,
    reset,
    formState: {
      errors,
      isSubmitting: formIsSubmitting,
      isValid: isFormValid,
      dirtyFields,
    },
  } = useFormContext<z.infer<typeof doc.schema>>();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const actualSchemaShape = useMemo(() => {
    const def = doc.schema?._def;
    if (!def) return undefined;
    return def.typeName === "ZodEffects"
      ? def.schema.shape
      : def.typeName === "ZodObject"
        ? def.shape
        : undefined;
  }, [doc.schema]);

  const steps = useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map((q) => {
        const fieldDef = (actualSchemaShape as any)?.[q.id]?._def;
        const labelFromDescription =
          fieldDef?.description ?? fieldDef?.schema?._def?.description;

        const label = q.label
          ? t(q.label, { defaultValue: q.label })
          : labelFromDescription
            ? t(labelFromDescription, { defaultValue: labelFromDescription })
            : t(`fields.${q.id}.label`, { defaultValue: prettify(q.id) });

        const tooltip =
          q.tooltip
            ? t(q.tooltip, { defaultValue: q.tooltip })
            : t(fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || "", {
                defaultValue:
                  fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || "",
              }) || undefined;

        return { id: q.id, label, tooltip };
      });
    }

    if (!actualSchemaShape) return [];

    return Object.keys(actualSchemaShape).map((key) => {
      const fieldDef = (actualSchemaShape as any)[key]?._def;
      const labelFromDescription =
        fieldDef?.description ?? fieldDef?.schema?._def?.description;
      const fieldLabel = labelFromDescription
        ? t(labelFromDescription, { defaultValue: labelFromDescription })
        : t(`fields.${key}.label`, { defaultValue: prettify(key) });

      return {
        id: key,
        label: fieldLabel,
        tooltip:
          t(fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || "", {
            defaultValue:
              fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || "",
          }) || undefined,
      };
    });
  }, [doc.questions, actualSchemaShape, t]);

  const totalSteps = steps.length;
  const currentField =
    !isReviewing && totalSteps > 0 && currentStepIndex < totalSteps
      ? steps[currentStepIndex]
      : null;
  const progress =
    totalSteps > 0
      ? ((isReviewing ? totalSteps : currentStepIndex + 1) / totalSteps) * 100
      : 0;

  const handlePreviousStep = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [isReviewing, currentStepIndex]);

  const handleNextStep = useCallback(async () => {
    let isValid = false;
    const currentStepFieldKey = steps[currentStepIndex]?.id;

    if (isReviewing) {
      await trigger(); // mark validation errors but allow continue
      if (!isLoggedIn) {
        setShowAuthModal(true);
        return;
      }
      try {
        const response = await axios.post(
          `/${locale}/api/wizard/${doc.id}/submit`,
          {
            values: getValues(),
            locale,
          },
        );
        localStorage.removeItem(`draft-${doc.id}-${locale}`);
        onComplete("/dashboard");
      } catch (error) {
        console.error("[WizardForm] API submission error:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{
            error?: string;
            details?: any;
            code?: string;
          }>;
          const apiErrorMsg =
            axiosError.response?.data?.error || axiosError.message;
          const apiErrorDetails = axiosError.response?.data?.details;
          let userFriendlyMessage = `${t("API Error Occurred", { defaultValue: "API Error Occurred" })}: ${apiErrorMsg}`;
          if (apiErrorDetails && typeof apiErrorDetails === "object") {
            userFriendlyMessage += ` Details: ${JSON.stringify(apiErrorDetails, null, 2)}`;
          }
          toast({
            title: t("API Error Occurred", {
              defaultValue: "API Error Occurred",
            }),
            description: userFriendlyMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: t("Error", { defaultValue: "Error" }),
            description: t("An unexpected error occurred.", {
              defaultValue: "An unexpected error occurred.",
            }),
            variant: "destructive",
          });
        }
      }
      return;
    }

    if (steps.length === 0) {
      const allValidForNoSteps = await trigger();
      if (allValidForNoSteps) {
        setIsReviewing(true);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        toast({
          title: t("Validation Failed"),
          description: t("Please correct all errors before reviewing."),
          variant: "destructive",
        });
      }
      return;
    }

    if (currentStepFieldKey) {
      isValid = await trigger(currentStepFieldKey as any);
    } else if (totalSteps > 0 && currentStepIndex < totalSteps) {
      console.error(
        "Error: currentStepFieldKey is undefined but totalSteps > 0. currentStepIndex:",
        currentStepIndex,
        "steps:",
        steps,
      );
      isValid = false;
    } else {
      isValid = await trigger();
    }

    if (!isValid) {
      toast({
        title: t("wizard.incompleteFieldsNotice"),
        variant: "destructive",
      });
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      await trigger(); // trigger validation but continue regardless
      setIsReviewing(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    if (liveRef.current && currentField) {
      liveRef.current.innerText = `${currentField.label} ${t("updated", { defaultValue: "updated" })}`;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.innerText = "";
      }, 1000);
    }
  }, [
    currentStepIndex,
    steps,
    totalSteps,
    isReviewing,
    isLoggedIn,
    trigger,
    locale,
    doc.id,
    getValues,
    onComplete,
    toast,
    t,
    currentField,
  ]);

  const handleSkipStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsReviewing(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentStepIndex, totalSteps]);

  if (!isHydrated || authIsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t("Loading document wizard...")}
        </p>
      </div>
    );
  }

  const buttonText = isReviewing
    ? t("wizard.generateDocument")
    : t("wizard.saveContinue");

  const formContent =
    currentField &&
    currentField.id &&
    actualSchemaShape &&
    (actualSchemaShape as any)[currentField.id] ? (
      <div className="mt-6 space-y-6 min-h-[200px]">
        {(actualSchemaShape as any)?.[currentField.id] &&
        ((actualSchemaShape as any)[currentField.id] instanceof z.ZodObject ||
          ((actualSchemaShape as any)[currentField.id]._def &&
            (actualSchemaShape as any)[currentField.id]._def.typeName ===
              "ZodObject")) &&
        (currentField.id.includes("_address") ||
          currentField.id.includes("Address")) ? (
          <Controller
            key={`${currentField.id}-controller`}
            control={control}
            name={currentField.id as any}
            render={({
              field: { onChange: rhfOnChange, value: rhfValue, name: rhfName },
            }) => (
              <AddressField
                name={rhfName}
                label={currentField.label}
                required={
                  (
                    doc.questions?.find((q) => q.id === currentField.id) ||
                    (actualSchemaShape as any)?.[currentField.id]?._def
                  )?.required
                }
                error={
                  errors[currentField.id as any]?.message as string | undefined
                }
                placeholder={t("Enter address...")}
                value={rhfValue || ""}
                onChange={(val, parts) => {
                  rhfOnChange(val);
                  if (parts && actualSchemaShape) {
                    const prefix =
                      currentField.id.replace(/_address$/i, "") ||
                      currentField.id.replace(/Address$/i, "");
                    if ((actualSchemaShape as any)?.[`${prefix}_city`])
                      setValue(`${prefix}_city`, parts.city, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    if ((actualSchemaShape as any)?.[`${prefix}_state`])
                      setValue(`${prefix}_state`, parts.state, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    if ((actualSchemaShape as any)?.[`${prefix}_postal_code`])
                      setValue(`${prefix}_postal_code`, parts.postalCode, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                  }
                }}
                tooltipText={currentField.tooltip}
              />
            )}
          />
        ) : (
          <FieldRenderer
            key={currentField.id}
            fieldKey={currentField.id}
            doc={doc}
          />
        )}
      </div>
    ) : (doc.questions?.length || 0) === 0 && !isReviewing ? (
      <div className="mt-6 min-h-[200px] flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">
          {t("dynamicForm.noQuestionsNeeded", {
            documentType:
              locale === "es"
                ? doc.translations?.es?.name || doc.name_es || doc.translations?.en?.name || doc.name
                : doc.translations?.en?.name || doc.name || doc.translations?.es?.name || doc.name_es,
          })}
        </p>
      </div>
    ) : null;

  return (
    <>
      <TooltipProvider>
        <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
          <div className="mb-6">
            {totalSteps > 0 && (
              <>
                <Progress
                  value={progress}
                  className="w-full h-2"
                  aria-label="Progress"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {Math.round(progress)}% {t("Complete")}
                </p>
              </>
            )}
          </div>

          {isReviewing ? <ReviewStep doc={doc} locale={locale} /> : formContent}

          <div className="sr-only" aria-live="polite" ref={liveRef}></div>

          {!isReviewing && <TrustBadges className="mt-6" />}

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {(currentStepIndex > 0 || isReviewing) && totalSteps > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={formIsSubmitting || authIsLoading}
                className="text-foreground border-border hover:bg-muted w-full sm:w-auto"
              >
                {t("Back")}
              </Button>
            )}
            {!(currentStepIndex > 0 || isReviewing) && totalSteps > 0 && (
              <div className="w-full sm:w-auto" />
            )}{" "}
            {/* Placeholder for spacing */}
            {!isReviewing && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkipStep}
                disabled={formIsSubmitting || authIsLoading}
                className="border border-dashed text-muted-foreground w-full sm:w-auto"
              >
                {t("wizard.skipQuestion")}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px] w-full sm:w-auto"
              disabled={
                formIsSubmitting ||
                authIsLoading ||
                (isReviewing && !isFormValid && Object.keys(errors).length > 0)
              }
            >
              {formIsSubmitting || authIsLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                buttonText
              )}
            </Button>
          </div>
          {isReviewing && (
            <div className="mt-4 text-center">
              <Link
                href={`/${locale}/#workflow-start`}
                className="text-sm text-primary hover:underline"
              >
                {t("wizard.changeDocument", {
                  defaultValue: "Change Document",
                })}
              </Link>
            </div>
          )}
        </div>
      </TooltipProvider>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          if (isLoggedIn && isReviewing) {
            handleNextStep();
          }
        }}
      />
    </>
  );
}
