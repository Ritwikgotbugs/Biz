import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ExternalLink, FileText, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { saveChecklistItems } from "@/lib/supabase";
import { ListIcon, LayoutGridIcon } from "lucide-react";

// Types
interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: "high" | "medium" | "low";
  deadline?: string;
  formUrl?: string;
  resources?: Array<{ title: string; url: string }>;
}

interface KanbanBoardProps {
  checklistItems: ChecklistItem[];
  onChecklistChange: (items: ChecklistItem[]) => void;
  onProgressChange?: (progress: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  checklistItems, 
  onChecklistChange,
  onProgressChange 
}) => {
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [columns, setColumns] = useState<Record<string, ChecklistItem[]>>({
    todo: [],
    completed: []
  });
  const [draggedItem, setDraggedItem] = useState<ChecklistItem | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [allExpanded, setAllExpanded] = useState(false);

  // Initialize columns when checklistItems change
  useEffect(() => {
    if (checklistItems && checklistItems.length > 0) {
      const newColumns = {
        todo: checklistItems.filter(item => !item.completed),
        completed: checklistItems.filter(item => item.completed)
      };
      setColumns(newColumns);
    }
  }, [checklistItems]);

  // Initialize expanded categories only once when component mounts
  useEffect(() => {
    if (checklistItems && checklistItems.length > 0 && Object.keys(expandedCategories).length === 0) {
      const categories = [...new Set(checklistItems.map(item => item.category))];
      const initialExpandedState = categories.reduce((acc, category) => {
        acc[category] = false; // Set to false to have all categories collapsed by default
        return acc;
      }, {} as Record<string, boolean>);
      
      setExpandedCategories(initialExpandedState);
    }
  }, [checklistItems]);

  // Toggle all categories
  const toggleAllCategories = () => {
    const categories = [...new Set(checklistItems.map(item => item.category))];
    const newExpandedState = !allExpanded;
    
    const updatedExpandedState = categories.reduce((acc, category) => {
      acc[category] = newExpandedState;
      return acc;
    }, {} as Record<string, boolean>);
    
    setExpandedCategories(updatedExpandedState);
    setAllExpanded(newExpandedState);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, item: ChecklistItem) => {
    setDraggedItem(item);
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    try {
      // Determine if the item is being moved to a different column
      const isMovingToCompleted = targetColumn === "completed" && !draggedItem.completed;
      const isMovingToTodo = targetColumn === "todo" && draggedItem.completed;
      
      if (isMovingToCompleted || isMovingToTodo) {
        // Update the completed status based on the destination column
        const updatedItem = { 
          ...draggedItem, 
          completed: targetColumn === "completed" 
        };
        
        // Update the main checklist items
        const updatedChecklistItems = checklistItems.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );
        
        onChecklistChange(updatedChecklistItems);

        // Save to backend
        await saveChecklistItems(updatedChecklistItems);

        // Update progress
        if (onProgressChange) {
          const completedCount = updatedChecklistItems.filter(item => item.completed).length;
          const totalCount = updatedChecklistItems.length;
          const progress = Math.round((completedCount / totalCount) * 100);
          onProgressChange(progress);
        }

        toast({
          title: updatedItem.completed ? "Task completed!" : "Task moved",
          description: updatedItem.title
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    } finally {
      setDraggedItem(null);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group items by category
  const groupItemsByCategory = (items: ChecklistItem[]) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ChecklistItem[]>);
    
    return grouped;
  };

  // If no checklist items, show a message
  if (!checklistItems || checklistItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">No checklist items available</p>
      </div>
    );
  }

  // Get unique categories
  const categories = [...new Set(checklistItems.map(item => item.category))];

  // Render the Kanban board with HTML5 drag and drop and categorization
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* To Do Column */}
      <div 
        className="bg-muted/20 rounded-lg p-3 border border-muted"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "todo")}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium text-gray-900">To Do ({columns.todo.length})</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllCategories}
              className="flex items-center gap-1 h-7 px-2"
            >
              <ChevronsUpDown className="h-3 w-3" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('list')}
                className="text-gray-500 hover:text-gray-700"
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="flex items-center gap-1 h-7 px-2"
              >
                <LayoutGridIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2 min-h-[250px]">
          {columns.todo && columns.todo.length > 0 ? (
            categories.map(category => {
              const categoryItems = columns.todo.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={`todo-${category}`} className="border rounded-md overflow-hidden">
                  <div 
                    className="bg-muted/30 p-1.5 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <h4 className="text-xs font-medium">{category}</h4>
                    <div className="flex items-center">
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full mr-1 text-[10px]">
                        {categoryItems.length}
                      </span>
                      {expandedCategories[category] ? (
                        <ChevronUp className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {expandedCategories[category] && (
                    <div className="p-1.5 space-y-1.5">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          className={cn(
                            "p-2 rounded-md border bg-white shadow-sm hover:shadow-md transition-shadow cursor-move",
                            draggedItem?.id === item.id && "opacity-50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-xs">{item.title}</h4>
                            <div className="flex items-center ml-1">
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full",
                                item.priority === "high" ? "bg-red-100 text-red-700" :
                                item.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                "bg-green-100 text-green-700"
                              )}>
                                {item.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          {item.deadline && (
                            <div className="flex items-center mt-1 text-[10px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              <span>{item.deadline}</span>
                            </div>
                          )}
                          <div className="flex items-center mt-1.5 gap-1 flex-wrap">
                            {item.formUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-1.5 text-[10px]"
                                asChild
                              >
                                <a href={item.formUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-2.5 w-2.5 mr-0.5" />
                                  Form
                                </a>
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-1.5 text-[10px]"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <FileText className="h-2.5 w-2.5 mr-0.5" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-base">{selectedItem?.title}</DialogTitle>
                                  <DialogDescription className="text-sm">{selectedItem?.description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 py-3">
                                  <div>
                                    <h4 className="text-xs font-medium mb-1">Category</h4>
                                    <p className="text-xs">{selectedItem?.category}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium mb-1">Priority</h4>
                                    <div className={cn(
                                      "inline-block text-[10px] px-1.5 py-0.5 rounded-full",
                                      selectedItem?.priority === "high" ? "bg-red-100 text-red-700" :
                                      selectedItem?.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                      "bg-green-100 text-green-700"
                                    )}>
                                      {selectedItem?.priority}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium mb-1">Deadline</h4>
                                    <p className="text-xs">{selectedItem?.deadline || "No deadline set"}</p>
                                  </div>
                                  {selectedItem?.formUrl && (
                                    <div>
                                      <h4 className="text-xs font-medium mb-1">Form Link</h4>
                                      <a 
                                        href={selectedItem.formUrl}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        className="text-xs text-primary hover:underline flex items-center"
                                      >
                                        <ExternalLink className="h-2.5 w-2.5 mr-1" />
                                        Access Form
                                      </a>
                                    </div>
                                  )}
                                  {selectedItem?.resources && selectedItem.resources.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-medium mb-1">Resources</h4>
                                      <ul className="space-y-1">
                                        {selectedItem.resources.map((resource, index) => (
                                          <li key={index}>
                                            <a 
                                              href={resource.url} 
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline flex items-center"
                                            >
                                              <FileText className="h-2.5 w-2.5 mr-1" />
                                              {resource.title}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-md text-xs">
              No tasks in this column
            </div>
          )}
        </div>
      </div>

      {/* Completed Column */}
      <div 
        className="bg-muted/20 rounded-lg p-3 border border-muted"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "completed")}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium text-gray-900">Completed ({columns.completed.length})</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllCategories}
              className="flex items-center gap-1 h-7 px-2"
            >
              <ChevronsUpDown className="h-3 w-3" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('list')}
                className="text-gray-500 hover:text-gray-700"
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="flex items-center gap-1 h-7 px-2"
              >
                <LayoutGridIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2 min-h-[250px]">
          {columns.completed && columns.completed.length > 0 ? (
            categories.map(category => {
              const categoryItems = columns.completed.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={`completed-${category}`} className="border rounded-md overflow-hidden">
                  <div 
                    className="bg-muted/30 p-1.5 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <h4 className="text-xs font-medium">{category}</h4>
                    <div className="flex items-center">
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full mr-1 text-[10px]">
                        {categoryItems.length}
                      </span>
                      {expandedCategories[category] ? (
                        <ChevronUp className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {expandedCategories[category] && (
                    <div className="p-1.5 space-y-1.5">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          className={cn(
                            "p-2 rounded-md border bg-white shadow-sm hover:shadow-md transition-shadow cursor-move",
                            draggedItem?.id === item.id && "opacity-50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-xs line-through text-muted-foreground">{item.title}</h4>
                            <div className="flex items-center ml-1">
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full",
                                item.priority === "high" ? "bg-red-100 text-red-700" :
                                item.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                "bg-green-100 text-green-700"
                              )}>
                                {item.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          {item.deadline && (
                            <div className="flex items-center mt-1 text-[10px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              <span>{item.deadline}</span>
                            </div>
                          )}
                          <div className="flex items-center mt-1.5 gap-1 flex-wrap">
                            {item.formUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-1.5 text-[10px]"
                                asChild
                              >
                                <a href={item.formUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-2.5 w-2.5 mr-0.5" />
                                  Form
                                </a>
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-1.5 text-[10px]"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <FileText className="h-2.5 w-2.5 mr-0.5" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-base">{selectedItem?.title}</DialogTitle>
                                  <DialogDescription className="text-sm">{selectedItem?.description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 py-3">
                                  <div>
                                    <h4 className="text-xs font-medium mb-1">Category</h4>
                                    <p className="text-xs">{selectedItem?.category}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium mb-1">Priority</h4>
                                    <div className={cn(
                                      "inline-block text-[10px] px-1.5 py-0.5 rounded-full",
                                      selectedItem?.priority === "high" ? "bg-red-100 text-red-700" :
                                      selectedItem?.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                      "bg-green-100 text-green-700"
                                    )}>
                                      {selectedItem?.priority}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium mb-1">Deadline</h4>
                                    <p className="text-xs">{selectedItem?.deadline || "No deadline set"}</p>
                                  </div>
                                  {selectedItem?.formUrl && (
                                    <div>
                                      <h4 className="text-xs font-medium mb-1">Form Link</h4>
                                      <a 
                                        href={selectedItem.formUrl}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        className="text-xs text-primary hover:underline flex items-center"
                                      >
                                        <ExternalLink className="h-2.5 w-2.5 mr-1" />
                                        Access Form
                                      </a>
                                    </div>
                                  )}
                                  {selectedItem?.resources && selectedItem.resources.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-medium mb-1">Resources</h4>
                                      <ul className="space-y-1">
                                        {selectedItem.resources.map((resource, index) => (
                                          <li key={index}>
                                            <a 
                                              href={resource.url} 
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline flex items-center"
                                            >
                                              <FileText className="h-2.5 w-2.5 mr-1" />
                                              {resource.title}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-md text-xs">
              No tasks in this column
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard; 