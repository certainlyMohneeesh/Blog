
interface Author {
  name: string | null; // Since `name` can be nullable in your schema
  image: string | null;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    authorId?: string;
    published: boolean;
    featured: boolean;
    author: Author;
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

  export interface HeaderProps {
    showAuth: boolean;
  }