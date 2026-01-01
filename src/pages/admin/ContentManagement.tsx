import { FileText } from "lucide-react";

const ContentManagement = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>

      <div className="text-center py-12 bg-secondary/30 rounded-lg">
        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Content Management</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          This section allows you to manage website content dynamically. 
          You can edit page text, update service descriptions, and manage 
          other content without touching the code.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Feature coming soon...
        </p>
      </div>
    </div>
  );
};

export default ContentManagement;
