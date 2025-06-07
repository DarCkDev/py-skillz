import { EditCreateUser, Error400Response, UserInfo, UserRole } from "@/types";

const API_URL = 'http://localhost:3003';

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
    });

    if (response.status !== 200) {
      throw new Error('Error al obtener la respuesta');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
}

type UpdateAPIResponse = UserInfo | Error400Response | string;
type DeleteAPIResponse = boolean | string;

export const updateUser = async (data: EditCreateUser): Promise<UpdateAPIResponse> => {
  try {
    const response = await fetch(`${API_URL}/user/${data.id}/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'application/json',
        'x-custom-lang': localStorage.getItem('i18nextLng') || 'es',
      },
      body: JSON.stringify(data)
    });
    const res = await response.json();
    if (response.ok) {
      return res as UserInfo;
    }
    if (response.status === 400) {
      return res as Error400Response;
    }
    throw new Error('Error inesperado.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Error inesperado: ${error.message}`;
    }
    return 'Error desconocido.'
  }
}


export const deleteUser = async (id: string): Promise<DeleteAPIResponse> => {
  try {
    const response = await fetch(`${API_URL}/user/${id}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'x-custom-lang': localStorage.getItem('i18nextLng') || 'es',
      }
    });
    if (response.status === 204) {
      return true;
    }
    const res = await response.json();
    if (response.status === 400 || response.status === 404) {
      return (res as Error400Response).message[0];
    }
    return 'Error inesperado.';
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Error inesperado: ${error.message}`;
    }
    return 'Error desconocido.'
  }
}

export const createUser = async (data: EditCreateUser): Promise<UserInfo | Error400Response | string> => {
  delete data.id;
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'application/json',
        'x-custom-lang': localStorage.getItem('i18nextLng') || 'es',
      },
      body: JSON.stringify(data)
    });
    const res = await response.json();
    if (response.ok) {
      return res as UserInfo;
    }
    if (response.status === 400) {
      return res as Error400Response;
    }
    throw new Error('Error inesperado.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Error inesperado: ${error.message}`;
    }
    return 'Error desconocido.'
  }
}

export const countUsers = async (role?: UserRole): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}/user/count?role=${role ? role : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'x-custom-lang': localStorage.getItem('i18nextLng') || 'es',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return 0;
  } catch {
    return 0;
  }
}