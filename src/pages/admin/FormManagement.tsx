import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, Eye, EyeOff, Check, X, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  created_at: string;
  updated_at: string;
}

const availablePages = [
  { value: "home", label: "Home Page" },
  { value: "services", label: "Services" },
  { value: "ai-consulting", label: "AI Consulting" },
  { value: "talent-solutions", label: "Talent Solutions" },
  { value: "nowrise-institute", label: "NowRise Institute" },
  { value: "careers", label: "Careers" },
  { value: "about", label: "About" },
  { value: "contact", label: "Contact" },
];

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email Input" },
  { value: "phone", label: "Phone Input" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown Select" },
];

const FormManagement = () => {
  const queryClient = useQueryClient();
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [editingForm, setEditingForm] = useState<Partial<CustomForm> | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    label: "",
    type: "text",
    required: false,
    placeholder: "",
  });

  const { data: forms, isLoading } = useQuery({
    queryKey: ["admin-custom-forms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((form) => ({
        ...form,
        fields: (form.fields as unknown as FormField[]) || [],
        display_type: form.display_type as "popup" | "section",
      })) as CustomForm[];
    },
  });

  const createForm = useMutation({
    mutationFn: async (formName: string) => {
      const { data, error } = await supabase
        .from("custom_forms")
        .insert({
          form_name: formName,
          target_page: "home",
          fields: [] as unknown as never,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        fields: (data.fields as unknown as FormField[]) || [],
        display_type: data.display_type as "popup" | "section",
      } as CustomForm;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-custom-forms"] });
      toast({ title: "Form created" });
      setNewFormName("");
      setIsCreating(false);
      setSelectedForm(data);
      setEditingForm(data);
    },
    onError: () => {
      toast({ title: "Failed to create form", variant: "destructive" });
    },
  });

  const updateForm = useMutation({
    mutationFn: async (form: Partial<CustomForm> & { id: string }) => {
      const { error } = await supabase
        .from("custom_forms")
        .update({
          form_name: form.form_name,
          description: form.description,
          fields: form.fields as unknown as never,
          target_page: form.target_page,
          display_type: form.display_type,
          is_published: form.is_published,
          popup_trigger_text: form.popup_trigger_text,
          section_title: form.section_title,
        })
        .eq("id", form.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-custom-forms"] });
      toast({ title: "Form saved" });
    },
    onError: () => {
      toast({ title: "Failed to save form", variant: "destructive" });
    },
  });

  const deleteForm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("custom_forms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-custom-forms"] });
      toast({ title: "Form deleted" });
      setSelectedForm(null);
      setEditingForm(null);
    },
    onError: () => {
      toast({ title: "Failed to delete form", variant: "destructive" });
    },
  });

  const handleAddField = () => {
    if (!editingForm || !newField.label?.trim()) return;

    const field: FormField = {
      id: crypto.randomUUID(),
      label: newField.label,
      type: newField.type as FormField["type"],
      required: newField.required || false,
      placeholder: newField.placeholder,
      options: newField.type === "select" ? ["Option 1", "Option 2"] : undefined,
    };

    setEditingForm({
      ...editingForm,
      fields: [...(editingForm.fields || []), field],
    });

    setNewField({ label: "", type: "text", required: false, placeholder: "" });
  };

  const handleRemoveField = (fieldId: string) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields?.filter((f) => f.id !== fieldId) || [],
    });
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields?.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ) || [],
    });
  };

  const handleSave = () => {
    if (editingForm && editingForm.id) {
      updateForm.mutate(editingForm as CustomForm);
    }
  };

  const togglePublish = () => {
    if (editingForm) {
      setEditingForm({ ...editingForm, is_published: !editingForm.is_published });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Form Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-gold flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          Create Form
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 bg-secondary rounded-lg flex items-center gap-4">
          <input
            type="text"
            placeholder="Form name (e.g., Newsletter Signup)"
            value={newFormName}
            onChange={(e) => setNewFormName(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={() => createForm.mutate(newFormName)}
            disabled={!newFormName.trim()}
            className="p-2 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
          >
            <Check size={20} />
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewFormName("");
            }}
            className="p-2 text-muted-foreground hover:bg-secondary rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        {/* Form List */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wider">
            Forms
          </h3>
          {forms && forms.length > 0 ? (
            <div className="space-y-2">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedForm?.id === form.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => {
                    setSelectedForm(form);
                    setEditingForm(form);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{form.form_name}</span>
                      {form.is_published ? (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {availablePages.find((p) => p.value === form.target_page)?.label || form.target_page}
                      {" • "}
                      {form.display_type === "popup" ? "Popup" : "Section"}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Form</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{form.form_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteForm.mutate(form.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No forms yet. Create one to get started.
            </p>
          )}
        </div>

        {/* Form Editor */}
        <div className="bg-background border border-border rounded-lg p-6">
          {editingForm ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <input
                    type="text"
                    value={editingForm.form_name || ""}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, form_name: e.target.value })
                    }
                    className="text-xl font-bold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure form fields and display settings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePublish}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      editingForm.is_published
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {editingForm.is_published ? (
                      <>
                        <Eye size={16} />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={16} />
                        Draft
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateForm.isPending}
                    className="btn-gold text-sm"
                  >
                    {updateForm.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Form Settings */}
              <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Page</label>
                  <Select
                    value={editingForm.target_page}
                    onValueChange={(value) =>
                      setEditingForm({ ...editingForm, target_page: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePages.map((page) => (
                        <SelectItem key={page.value} value={page.value}>
                          {page.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Display Type</label>
                  <Select
                    value={editingForm.display_type}
                    onValueChange={(value: "popup" | "section") =>
                      setEditingForm({ ...editingForm, display_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select display type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popup">Popup Modal</SelectItem>
                      <SelectItem value="section">Page Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingForm.display_type === "popup" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Popup Trigger Button Text
                    </label>
                    <input
                      type="text"
                      value={editingForm.popup_trigger_text || ""}
                      onChange={(e) =>
                        setEditingForm({
                          ...editingForm,
                          popup_trigger_text: e.target.value,
                        })
                      }
                      placeholder="e.g., Get Started"
                      className="w-full px-4 py-2 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}

                {editingForm.display_type === "section" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Title</label>
                    <input
                      type="text"
                      value={editingForm.section_title || ""}
                      onChange={(e) =>
                        setEditingForm({
                          ...editingForm,
                          section_title: e.target.value,
                        })
                      }
                      placeholder="e.g., Contact Us"
                      className="w-full px-4 py-2 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editingForm.description || ""}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, description: e.target.value })
                    }
                    placeholder="Brief description of the form..."
                    rows={2}
                    className="w-full px-4 py-2 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
                <div className="space-y-3">
                  {editingForm.fields?.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg group"
                    >
                      <GripVertical size={16} className="text-muted-foreground" />
                      <div className="flex-1 grid grid-cols-4 gap-3 items-center">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            handleUpdateField(field.id, { label: e.target.value })
                          }
                          className="px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <Select
                          value={field.type}
                          onValueChange={(value: FormField["type"]) =>
                            handleUpdateField(field.id, { type: value })
                          }
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            handleUpdateField(field.id, { placeholder: e.target.value })
                          }
                          placeholder="Placeholder..."
                          className="px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                handleUpdateField(field.id, { required: e.target.checked })
                              }
                              className="rounded border-border"
                            />
                            Required
                          </label>
                          <button
                            onClick={() => handleRemoveField(field.id)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!editingForm.fields || editingForm.fields.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No fields yet. Add fields below.
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Field */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium mb-3">Add New Field</h4>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Label</label>
                    <input
                      type="text"
                      value={newField.label || ""}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="Field label"
                      className="w-full px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="w-40">
                    <label className="block text-xs text-muted-foreground mb-1">Type</label>
                    <Select
                      value={newField.type}
                      onValueChange={(value: FormField["type"]) =>
                        setNewField({ ...newField, type: value })
                      }
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={newField.placeholder || ""}
                      onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                      placeholder="Placeholder text"
                      className="w-full px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm pb-2">
                    <input
                      type="checkbox"
                      checked={newField.required || false}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="rounded border-border"
                    />
                    Required
                  </label>
                  <button
                    onClick={handleAddField}
                    disabled={!newField.label?.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Edit2 size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Form</h3>
              <p className="text-muted-foreground">
                Choose a form from the left to edit or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormManagement;