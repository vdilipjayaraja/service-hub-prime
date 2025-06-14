
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { ServiceRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useServiceRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: serviceRequests = [], isLoading, error } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: async () => {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          clients(name),
          technicians(name)
        `)
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (user?.role === 'client') {
        query = query.eq('submitted_by', user.id);
      } else if (user?.role === 'technician') {
        // Show assigned requests and unassigned ones
        query = query.or(`assigned_to.eq.${user.id},assigned_to.is.null`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching service requests:', error);
        throw error;
      }

      return data?.map(request => ({
        id: request.id,
        ticketId: request.ticket_id,
        clientId: request.client_id,
        deviceId: request.device_id,
        title: request.title,
        description: request.description,
        status: request.status,
        priority: request.priority,
        assignedTo: request.assigned_to,
        submittedBy: request.submitted_by,
        createdAt: request.created_at,
        updatedAt: request.updated_at,
        assignedAt: request.assigned_at,
        resolutionNotes: request.resolution_notes,
        clientName: request.clients?.name,
        technicianName: request.technicians?.name
      })) as ServiceRequest[] || [];
    },
    enabled: !!user
  });

  const updateServiceRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServiceRequest> }) => {
      const dbUpdates: any = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.resolutionNotes !== undefined) dbUpdates.resolution_notes = updates.resolutionNotes;
      if (updates.assignedAt) dbUpdates.assigned_at = updates.assignedAt;
      
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('service_requests')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }
  });

  const createServiceRequestMutation = useMutation({
    mutationFn: async (newRequest: Omit<ServiceRequest, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          client_id: newRequest.clientId,
          device_id: newRequest.deviceId,
          title: newRequest.title,
          description: newRequest.description,
          status: newRequest.status,
          priority: newRequest.priority,
          assigned_to: newRequest.assignedTo,
          submitted_by: newRequest.submittedBy
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating service request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    }
  });

  return {
    serviceRequests,
    isLoading,
    error,
    updateServiceRequest: updateServiceRequestMutation.mutate,
    createServiceRequest: createServiceRequestMutation.mutate,
    isUpdating: updateServiceRequestMutation.isPending,
    isCreating: createServiceRequestMutation.isPending
  };
};
