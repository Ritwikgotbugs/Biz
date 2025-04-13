import { supabase } from '@/integrations/supabase/client';

export const saveUserProfile = async (profile: any) => {
  try {
    const { data: userResponse } = await supabase.auth.getUser();
    
    if (!userResponse?.user?.id) {
      // Save to localStorage even if not authenticated
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('isOnboarded', 'true'); // Set the onboarded flag
      return true;
    }
    
    const userId = userResponse.user.id;
    
    // First, check if the profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    const profileData = {
      id: userId,
      company_name: profile.companyName,
      incorporation_date: profile.incorporationDate,
      registration_state: profile.registrationState,
      annual_turnover: profile.annualTurnover,
      employee_count: profile.employeeCount,
      sector: profile.sector,
      business_type: profile.businessType,
      updated_at: new Date().toISOString(),
    };
    
    let error;
    
    if (existingProfile) {
      // Update existing profile
      const result = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
        
      error = result.error;
    } else {
      // Insert new profile
      const result = await supabase
        .from('profiles')
        .insert(profileData);
        
      error = result.error;
    }
    
    if (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
    
    // Set flags in localStorage for fallback
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('isOnboarded', 'true');
    
    return true;
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    
    // Set localStorage fallbacks even on error
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('isOnboarded', 'true');
    
    // Don't throw, return success since we saved locally
    return true;
  }
};

export const getUserProfile = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user?.id) {
    // If not authenticated, try to get from localStorage
    const localProfile = localStorage.getItem('userProfile');
    return localProfile ? JSON.parse(localProfile) : null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    // Fall back to localStorage if DB fetch fails
    const localProfile = localStorage.getItem('userProfile');
    return localProfile ? JSON.parse(localProfile) : null;
  }
  
  // Convert DB format to application format
  const appProfile = data ? {
    companyName: data.company_name,
    incorporationDate: data.incorporation_date,
    registrationState: data.registration_state,
    annualTurnover: data.annual_turnover,
    employeeCount: data.employee_count,
    sector: data.sector,
    businessType: data.business_type
  } : null;
  
  // Update localStorage with the latest data
  if (appProfile) {
    localStorage.setItem('userProfile', JSON.stringify(appProfile));
  }
  
  return appProfile;
};

export const saveChecklistItems = async (items: any[]) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user?.id) {
    // Save to localStorage if user is not authenticated
    localStorage.setItem('userChecklist', JSON.stringify(items));
    return;
  }
  
  // Prepare items for database with user_id
  const itemsWithUserId = items.map(item => ({
    user_id: user.user.id,
    item_id: item.id || item.item_id,
    title: item.title,
    category: item.category,
    description: item.description,
    completed: item.completed,
    priority: item.priority,
    updated_at: new Date().toISOString()
  }));
  
  // Use upsert to handle both create and update operations
  const { error } = await supabase
    .from('checklist_items')
    .upsert(itemsWithUserId, { 
      onConflict: 'user_id,item_id',
      ignoreDuplicates: false
    });
  
  if (error) {
    console.error('Error saving checklist items:', error);
    // Still save to localStorage as backup
    localStorage.setItem('userChecklist', JSON.stringify(items));
    throw error;
  }
  
  // Also save to localStorage for offline access
  localStorage.setItem('userChecklist', JSON.stringify(items));
  
  return true;
};

export const getChecklistItems = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user?.id) {
    // If not authenticated, try to get from localStorage
    const localChecklist = localStorage.getItem('userChecklist');
    return localChecklist ? JSON.parse(localChecklist) : [];
  }
  
  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('user_id', user.user.id);
  
  if (error) {
    console.error('Error fetching checklist items:', error);
    // Fall back to localStorage if DB fetch fails
    const localChecklist = localStorage.getItem('userChecklist');
    return localChecklist ? JSON.parse(localChecklist) : [];
  }
  
  if (data && data.length > 0) {
    // Convert DB format to application format
    const formattedItems = data.map(item => ({
      id: item.item_id,
      item_id: item.item_id,
      title: item.title,
      category: item.category,
      description: item.description,
      completed: item.completed,
      priority: item.priority
    }));
    
    // Update localStorage with the latest data
    localStorage.setItem('userChecklist', JSON.stringify(formattedItems));
    return formattedItems;
  } else {
    // If no items in DB, try localStorage
    const localChecklist = localStorage.getItem('userChecklist');
    return localChecklist ? JSON.parse(localChecklist) : [];
  }
};

// New knowledge base document functions
export const saveKnowledgeDocument = async (document: any) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user?.id) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('knowledge_documents')
    .insert({
      user_id: user.user.id,
      name: document.name,
      description: document.description || '',
      file_path: document.file_path,
      file_type: document.file_type,
      file_size: document.file_size,
      is_admin_document: document.is_admin_document || false
    });
  
  if (error) {
    console.error('Error saving knowledge document:', error);
    throw error;
  }
  
  return true;
};

export const getKnowledgeDocuments = async (includeAdminDocs = false) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user?.id) {
    return [];
  }
  
  let query = supabase
    .from('knowledge_documents')
    .select('*');
    
  if (includeAdminDocs) {
    query = query.or(`user_id.eq.${user.user.id},is_admin_document.eq.true`);
  } else {
    query = query.eq('user_id', user.user.id);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching knowledge documents:', error);
    return [];
  }
  
  return data || [];
};
