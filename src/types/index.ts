export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    authorId?: string;
  }

   export interface GitHubProfile {
    login: string;
    email: string;
    name: string;
    avatar_url: string;
  }
  
  export interface BlogFormProps {
    initialData?: {
      title: string;
      content: string;
      id?: string;
    };
    isEditing?: boolean;
  }