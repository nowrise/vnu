import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "phone";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface CustomForm {
  id: string;
  form_name: string;
  description: string | null;
  fields: FormField[];
  target_page: string;
  display_type: "popup" | "section";
  is_published: boolean;
  popup_trigger_text: string | null;
  section_title: string | null;
}

interface DynamicFormDisplayProps {
  pageName: string;
}

export const DynamicFormDisplay = ({ pageName }: DynamicFormDisplayProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  const { data: forms } = useQuery({
    queryKey: ["published-forms", pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_forms")
        .select("*")
        .eq("target_page", pageName)
        .eq("is_published", true);

      if (error) throw error;
      return (data || []).map((form) => ({
        ...form,
        fields: (form.fields as unknown as FormField[]) || [],
        display_type: form.display_type as "popup" | "section",
      })) as CustomForm[];
    },
  });

  const submitForm = useMutation({
    mutationFn: async ({ formId, data }: { formId: string; data: Record<string, string> }) => {
      const { error } = await supabase.from("form_submissions").insert({
        form_id: formId,
        submission_data: data,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      setSubmitted(variables.formId);
      setFormData({});
      setTimeout(() => {
        setSubmitted(null);
        setIsPopupOpen(false);
      }, 2000);
    },
    onError: () => {
      toast({ title: "Failed to submit form", variant: "destructive" });
    },
  });

  const handleSubmit = (form: CustomForm, e: React.FormEvent) => {
    e.preventDefault();
    submitForm.mutate({ formId: form.id, data: formData });
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const popupForms = forms?.filter((f) => f.display_type === "popup") || [];
  const sectionForms = forms?.filter((f) => f.display_type === "section") || [];

  const renderField = (field: FormField) => {
    const baseClasses =
      "w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={field.id}
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={`${baseClasses} resize-none`}
          />
        );
      case "select":
        return (
          <select
            key={field.id}
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            required={field.required}
            className={baseClasses}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            key={field.id}
            type={field.type}
            value={formData[field.label] || ""}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );
    }
  };

  const renderForm = (form: CustomForm, isInPopup = false) => {
    if (submitted === form.id) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">Your submission has been received.</p>
        </motion.div>
      );
    }

    return (
      <form onSubmit={(e) => handleSubmit(form, e)} className="space-y-4">
        {form.fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        <button
          type="submit"
          disabled={submitForm.isPending}
          className="btn-gold w-full flex items-center justify-center gap-2"
        >
          {submitForm.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    );
  };

  return (
    <>
      {/* Popup Trigger Buttons */}
      {popupForms.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {popupForms.map((form) => (
            <motion.button
              key={form.id}
              onClick={() => {
                setIsPopupOpen(true);
                setFormData({});
              }}
              className="btn-gold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {form.popup_trigger_text || "Get Started"}
            </motion.button>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && popupForms[0] && (
          <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{popupForms[0].form_name}</DialogTitle>
                {popupForms[0].description && (
                  <DialogDescription>{popupForms[0].description}</DialogDescription>
                )}
              </DialogHeader>
              {renderForm(popupForms[0], true)}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Section Forms */}
      {sectionForms.map((form) => (
        <section
          key={form.id}
          className="section-padding bg-gradient-to-br from-primary/5 to-primary/10"
        >
          <div className="container-custom max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-heading mb-3">{form.section_title || form.form_name}</h2>
                {form.description && (
                  <p className="text-muted-foreground">{form.description}</p>
                )}
              </div>
              {renderForm(form)}
            </motion.div>
          </div>
        </section>
      ))}
    </>
  );
};

export default DynamicFormDisplay;