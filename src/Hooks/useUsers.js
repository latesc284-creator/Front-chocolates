// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from "../Service/Admin/CreateUser";
import { removeCredits } from "../Service/Admin/removeCredits";
import { addCredits } from "../Service/Admin/addCredits";
import { getAlluser } from "../Service/Admin/getAlluser";

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Query para obtener usuarios
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAlluser,
    refetchInterval: 30000, // Refetch cada 30 segundos
  });

  // Mutación para crear usuario
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      throw error;
    }
  });

  // Mutación para actualizar créditos
  const updateCreditsMutation = useMutation({
    mutationFn: updateCredits,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['users']);
      // Actualización optimista opcional
      queryClient.setQueryData(['users'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(user => 
          user._id === variables.userId 
            ? { ...user, credits: data.credits }
            : user
        );
      });
    }
  });

 

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    updateCredits: updateCreditsMutation.mutateAsync,
    isUpdating: updateCreditsMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
    refetch: usersQuery.refetch
  };
};