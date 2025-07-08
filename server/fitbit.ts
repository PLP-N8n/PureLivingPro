// Fitbit API integration for wearable device data syncing
import axios from 'axios';

const FITBIT_API_BASE = 'https://api.fitbit.com/1';

export interface FitbitTokens {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_in?: number;
}

export interface FitbitActivityData {
  steps: number;
  distance: number;
  calories: number;
  heart_rate?: number;
  sleep_hours?: number;
  date: string;
}

// Exchange authorization code for access tokens
export async function exchangeFitbitCode(code: string, redirectUri: string): Promise<FitbitTokens> {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Fitbit credentials not configured');
  }

  const response = await axios.post('https://api.fitbit.com/oauth2/token', {
    client_id: clientId,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code: code,
  }, {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

// Refresh expired access token
export async function refreshFitbitToken(refreshToken: string): Promise<FitbitTokens> {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Fitbit credentials not configured');
  }

  const response = await axios.post('https://api.fitbit.com/oauth2/token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }, {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

// Get daily activity summary
export async function getFitbitDailyActivity(accessToken: string, date: string): Promise<FitbitActivityData> {
  const headers = { 'Authorization': `Bearer ${accessToken}` };
  
  try {
    // Get activity summary
    const activityResponse = await axios.get(
      `${FITBIT_API_BASE}/user/-/activities/date/${date}.json`,
      { headers }
    );

    // Get heart rate data
    let heartRate;
    try {
      const heartResponse = await axios.get(
        `${FITBIT_API_BASE}/user/-/activities/heart/date/${date}/1d.json`,
        { headers }
      );
      heartRate = heartResponse.data['activities-heart'][0]?.value?.restingHeartRate;
    } catch (error) {
      console.log('Heart rate data not available');
    }

    // Get sleep data
    let sleepHours;
    try {
      const sleepResponse = await axios.get(
        `${FITBIT_API_BASE}/user/-/sleep/date/${date}.json`,
        { headers }
      );
      const sleepData = sleepResponse.data.summary;
      sleepHours = sleepData?.totalTimeInBed ? sleepData.totalTimeInBed / 60 : undefined;
    } catch (error) {
      console.log('Sleep data not available');
    }

    const activity = activityResponse.data.summary;
    
    return {
      steps: activity.steps || 0,
      distance: parseFloat(activity.distances?.[0]?.distance || '0'),
      calories: activity.caloriesOut || 0,
      heart_rate: heartRate,
      sleep_hours: sleepHours,
      date: date,
    };
  } catch (error) {
    console.error('Error fetching Fitbit data:', error);
    throw new Error('Failed to fetch Fitbit activity data');
  }
}

// Get historical data for the past week
export async function getFitbitWeeklyData(accessToken: string): Promise<FitbitActivityData[]> {
  const activities: FitbitActivityData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const dailyData = await getFitbitDailyActivity(accessToken, dateStr);
      activities.push(dailyData);
    } catch (error) {
      console.error(`Error fetching data for ${dateStr}:`, error);
    }
  }
  
  return activities;
}

// Generate Fitbit OAuth URL
export function getFitbitAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.FITBIT_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('Fitbit client ID not configured');
  }

  const scopes = [
    'activity',
    'heartrate',
    'location',
    'nutrition',
    'profile',
    'settings',
    'sleep',
    'social',
    'weight'
  ].join('%20');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    expires_in: '604800', // 1 week
  });

  if (state) {
    params.append('state', state);
  }

  return `https://www.fitbit.com/oauth2/authorize?${params.toString()}`;
}