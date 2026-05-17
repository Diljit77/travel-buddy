export function getTodayPlan(trip: any) {
  if (!trip?.plan?.itinerary) return { dayIndex: 0, plan: null };
  
  const today = new Date();
  const startDate = trip.journeyState?.startedAt ? new Date(trip.journeyState.startedAt) : (trip.startDate ? new Date(trip.startDate) : new Date());
  
  const diffTime = Math.max(today.getTime() - startDate.getTime(), 0);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const dayIndex = Math.min(diffDays, trip.plan.itinerary.length - 1);
  return { dayIndex, plan: trip.plan.itinerary[dayIndex] };
}

export function getCurrentActivity(trip: any, todayPlanObj: any, currentTime: Date = new Date()) {
  const plan = todayPlanObj?.plan;
  const dayIndex = todayPlanObj?.dayIndex || 0;
  if (!plan?.plan && !plan?.events) return null;
  
  const activities = plan.plan || plan.events;
  const completedActivities = trip?.completedActivities || [];

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    
    // Check if explicitly completed
    const isCompleted = completedActivities.some((a: any) => a.day === dayIndex && a.activityIndex === i);
    if (isCompleted) continue; // Skip to next to find the first incomplete one

    // If not completed, this is our candidate for "current" or "upcoming"
    const timeString = activity.time || "12:00 PM - 01:00 PM";
    const [timeStr] = timeString.split('-'); 
    let hour = parseInt(timeStr.split(':')[0]) || 12;
    const minutes = parseInt(timeStr.split(':')[1]?.substring(0,2) || "0");
    if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
    if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
    
    const activityTotalMinutes = hour * 60 + minutes;
    
    // It's the active one if we reached it
    if (currentTotalMinutes >= activityTotalMinutes) {
       return { ...activity, index: i, status: 'ongoing' };
    } else {
       return { ...activity, index: i, status: 'upcoming' };
    }
  }
  
  // All completed
  return { ...activities[activities.length - 1], index: activities.length - 1, status: 'completed' };
}

export function getNextActivity(todayPlan: any, currentActivityIndex: number) {
  const activities = todayPlan?.plan || todayPlan?.events || [];
  if (currentActivityIndex + 1 < activities.length) {
    return activities[currentActivityIndex + 1];
  }
  return null;
}

export function calculateTripProgress(trip: any) {
  if (!trip?.plan?.itinerary) return 0;
  
  const totalDays = trip.plan.itinerary.length;
  const startDate = trip.journeyState?.startedAt ? new Date(trip.journeyState.startedAt) : (trip.startDate ? new Date(trip.startDate) : new Date());
  const today = new Date();
  
  const diffTime = today.getTime() - startDate.getTime();
  if (diffTime < 0) return 0; 
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays >= totalDays) return 100; 
  
  const todayPlanObj = getTodayPlan(trip);
  const activities = todayPlanObj?.plan?.plan || todayPlanObj?.plan?.events || [];
  
  const completedToday = (trip.completedActivities || []).filter((a: any) => a.day === todayPlanObj.dayIndex).length;
  const dayProgress = activities.length > 0 ? (completedToday / activities.length) : 0;
  
  const totalProgress = ((diffDays + dayProgress) / totalDays) * 100;
  return Math.min(Math.round(totalProgress), 100);
}

export function generateDynamicInsights(trip: any, currentActivity: any, weather: any = null) {
  const insights = [];
  
  if (weather?.condition === 'Rain' && currentActivity?.type === 'Outdoor') {
    insights.push({ type: 'warning', message: 'Rain expected during your next outdoor activity. Consider an indoor alternative.' });
  }

  if (currentActivity?.status === 'ongoing') {
    insights.push({ type: 'info', message: `Currently at ${currentActivity.activity || currentActivity.title}. Crowd levels are typical for this time.` });
  } else if (currentActivity?.status === 'upcoming') {
    insights.push({ type: 'info', message: `Up next: ${currentActivity.activity || currentActivity.title}.` });
  }

  const delay = detectDelay(currentActivity);
  if (delay?.isDelayed) {
    insights.push({ type: 'warning', message: `You appear to be running ${delay.delayMinutes} mins behind schedule.` });
  }

  if (trip.budget && budgetStatus(trip.budget, trip.expenses).percentage > 90) {
    insights.push({ type: 'alert', message: 'You are nearing your budget limit. Opt for budget-friendly meals today.' });
  }

  if (insights.length === 0) {
     insights.push({ type: 'success', message: 'You are right on schedule! Enjoy your journey.' });
  }
  
  return insights;
}

export function detectDelay(currentActivity: any, actualTime: Date = new Date()) {
  if (!currentActivity) return { isDelayed: false, delayMinutes: 0 };
  
  const currentHour = actualTime.getHours();
  const currentMinutes = actualTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  const timeString = currentActivity.time || "12:00 PM - 01:00 PM";
  const [timeStr] = timeString.split('-');
  let hour = parseInt(timeStr.split(':')[0]) || 12;
  const minutes = parseInt(timeStr.split(':')[1]?.substring(0,2) || "0");
  if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
  if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
  
  const activityTotalMinutes = hour * 60 + minutes;

  // If actual time is > 30 minutes past the scheduled time
  const delayMinutes = currentTotalMinutes - activityTotalMinutes;
  if (delayMinutes > 30) {
    return { isDelayed: true, delayMinutes };
  }
  return { isDelayed: false, delayMinutes: 0 };
}

export function budgetStatus(totalBudget: number, expenses: any[] = []) {
  if (!totalBudget) return { spent: 0, remaining: 0, percentage: 0 };
  
  const spent = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const remaining = Math.max(totalBudget - spent, 0);
  const percentage = Math.min((spent / totalBudget) * 100, 100);
  
  return {
    spent,
    remaining,
    percentage: Math.round(percentage)
  };
}
