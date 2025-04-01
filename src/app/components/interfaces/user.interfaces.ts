export interface User {
    id: number; // Asegúrate de que la propiedad id esté definida sin el signo de interrogación
    code?: string;
    description: string;
    first_name?: string; // Opcional
    last_name?: string;  // Opcional
    email: string;
    phone: string;
    rol_description?: string;
    username: string;
    password: string; 
    roles_id: number;
    sales_Organizations_id?: number;
    clients?: { id: number }[]; // Asegúrate de que esta propiedad existe para la lógica de filtrado
  }
  