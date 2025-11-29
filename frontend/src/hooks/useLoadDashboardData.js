import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAccreditation } from 'store/slices/accreditationSlice';
import { fetchInstitutionMetrics } from 'store/slices/institutionSlice';

// Hook to orchestrate loading mock data for dashboards without backend
export const useLoadDashboardData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      // Load accreditation (criteria, cycle, progress) and institution metrics from backend APIs
      await dispatch(fetchAccreditation());
      await dispatch(fetchInstitutionMetrics());
    })();
  }, [dispatch]);
};

export default useLoadDashboardData;
