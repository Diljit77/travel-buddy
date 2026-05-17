import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Expense {
  id: string;
  amount: number;
  category: string;
  title: string;
  date: string;
}

interface JourneyState {
  trip: any | null;
  currentActivity: any | null;
  expenses: Expense[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTrip: (id: string) => Promise<void>;
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => Promise<void>;
  updateActivityStatus: (tripId: string, day: number, activityIndex: number) => Promise<void>;
  updateJourneyStatus: (tripId: string, status: string) => Promise<void>;
  updateLocation: (tripId: string, lat: number, lng: number) => Promise<void>;
  replanJourney: (tripId: string, parameters: any) => Promise<void>;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      trip: null,
      currentActivity: null,
      expenses: [],
      loading: false,
      error: null,

      fetchTrip: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/trip/${id}`);
          if (!res.ok) throw new Error('Failed to fetch trip data');
          const data = await res.json();
          
          if (data.success && data.data) {
            set({ 
              trip: data.data,
              expenses: data.data.expenses || [],
              loading: false 
            });
          } else {
            set({ error: 'Invalid trip data format', loading: false });
          }
        } catch (err: any) {
          // If offline, the persist middleware keeps the old state, just turn off loading
          set({ error: err.message || 'Error fetching trip (You might be offline)', loading: false });
        }
      },

      addExpense: async (tripId: string, expense: Omit<Expense, 'id'>) => {
        const tempId = Math.random().toString(36).substring(7);
        const newExpense = { ...expense, id: tempId };
        
        // Optimistic UI Update
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
          trip: state.trip ? {
            ...state.trip,
            expenses: [newExpense, ...(state.trip.expenses || [])]
          } : null
        }));

        try {
          const res = await fetch(`/api/trip/${tripId}/expense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
          });
          
          const data = await res.json();
          if (!data.success) throw new Error(data.message || 'Failed to add expense');
          
          set((state) => ({
            expenses: state.expenses.map(e => e.id === tempId ? { ...e, id: data.data._id || tempId } : e)
          }));
        } catch (err: any) {
          // Safe Rollback
          set((state) => ({
            expenses: state.expenses.filter(e => e.id !== tempId),
            trip: state.trip ? {
              ...state.trip,
              expenses: state.trip.expenses?.filter((e: any) => e.id !== tempId) || []
            } : null,
            error: "Failed to sync expense. Reverted safely."
          }));
        }
      },

      updateActivityStatus: async (tripId: string, day: number, activityIndex: number) => {
        const previousTripState = get().trip; // Backup for safe rollback

        // Optimistic UI Update
        set((state) => {
          if (!state.trip) return state;
          const updatedTrip = { ...state.trip }; 
          if (!updatedTrip.completedActivities) updatedTrip.completedActivities = [];
          
          // Prevent local duplicate
          const exists = updatedTrip.completedActivities.some((a: any) => a.day === day && a.activityIndex === activityIndex);
          if (!exists) {
            updatedTrip.completedActivities.push({ day, activityIndex, completedAt: new Date() });
          }
          return { trip: updatedTrip };
        });

        try {
          const res = await fetch(`/api/trip/${tripId}/activity`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, activityIndex }),
          });
          if (!res.ok) throw new Error('Failed to update activity');
        } catch (err: any) {
          // Safe Rollback
          set({ trip: previousTripState, error: "Network error. Activity completion reverted safely." });
        }
      },

      updateJourneyStatus: async (tripId: string, status: string) => {
        const previousTripState = get().trip;

        set((state) => {
          if (!state.trip) return state;
          return { trip: { ...state.trip, status } };
        });

        try {
          const res = await fetch(`/api/trip/${tripId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
          if (!res.ok) throw new Error('Failed to update journey status');
        } catch (err: any) {
          set({ trip: previousTripState, error: "Failed to update journey status. Reverted safely." });
        }
      },

      updateLocation: async (tripId: string, lat: number, lng: number) => {
        set((state) => {
          if (!state.trip) return state;
          return {
            trip: {
              ...state.trip,
              journeyState: {
                ...state.trip.journeyState,
                lastKnownLocation: { lat, lng }
              }
            }
          };
        });

        try {
          // We assume a PATCH endpoint exists or will exist.
          // For resilience, if it fails, it just stays locally synced.
          await fetch(`/api/trip/${tripId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lastKnownLocation: { lat, lng } }),
          });
        } catch (err) {
          // Silent catch for background location sync
          console.warn("Offline: Location saved locally.");
        }
      },

      replanJourney: async (tripId: string, parameters: any) => {
        const previousTripState = get().trip; // Safe AI Rollback Protection
        
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/trip/${tripId}/replan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parameters),
          });
          
          const data = await res.json();
          if (data.success && data.data) {
            set({ trip: data.data, loading: false });
          } else {
            throw new Error(data.message || 'AI failed to generate valid itinerary');
          }
        } catch (err: any) {
          // AI Fallback Protection: Revert to the last known stable itinerary instantly
          set({ 
            trip: previousTripState, 
            error: err.message || "AI Replanning failed. Your original itinerary has been safely restored.", 
            loading: false 
          });
        }
      }
    }),
    {
      name: 'travel-buddy-journey-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // default is localStorage
      partialize: (state) => ({ trip: state.trip, expenses: state.expenses }), // Only persist critical data
    }
  )
);
