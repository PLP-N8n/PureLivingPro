import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Watch, 
  Smartphone, 
  Activity, 
  Heart, 
  Moon, 
  TrendingUp,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Calendar,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FitnessData {
  id: number;
  deviceType: string;
  dataType: string;
  value: string;
  unit: string;
  recordedAt: string;
  metadata?: {
    deviceModel?: string;
    workoutType?: string;
  };
}

interface DeviceConnection {
  fitbitConnected: boolean;
  appleHealthConnected: boolean;
  lastSyncAt?: string;
}

export default function DeviceIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch device connection status
  const { data: deviceStatus, isLoading: statusLoading } = useQuery<DeviceConnection>({
    queryKey: ['/api/devices/status'],
  });

  // Fetch recent fitness data
  const { data: fitnessData, isLoading: dataLoading } = useQuery<FitnessData[]>({
    queryKey: ['/api/fitness/data'],
  });

  // Connect to Fitbit
  const connectFitbit = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/devices/fitbit/auth');
      const data = await response.json();
      window.location.href = data.authUrl;
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Fitbit. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Sync data manually
  const syncData = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/devices/sync');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fitness/data'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices/status'] });
      toast({
        title: "Sync Complete",
        description: "Your fitness data has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: "Unable to sync your fitness data. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Disconnect device
  const disconnectDevice = useMutation({
    mutationFn: async (deviceType: string) => {
      await apiRequest('POST', '/api/devices/disconnect', { deviceType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices/status'] });
      toast({
        title: "Device Disconnected",
        description: "Your device has been disconnected successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Disconnect Failed",
        description: "Unable to disconnect device. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get data type icon
  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'steps': return <Activity className="w-4 h-4" />;
      case 'heart_rate': return <Heart className="w-4 h-4" />;
      case 'sleep': return <Moon className="w-4 h-4" />;
      case 'calories': return <TrendingUp className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  // Get device type color
  const getDeviceColor = (deviceType: string) => {
    switch (deviceType) {
      case 'fitbit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'apple_health': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-tulsi-100 text-tulsi-700 border-tulsi-200';
    }
  };

  if (statusLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tulsi-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-tulsi-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-tulsi-100 rounded-lg"></div>
              <div className="h-64 bg-tulsi-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tulsi-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-tulsi-800 mb-2">Device Integration</h1>
          <p className="text-tulsi-600 font-light">
            Connect your wearable devices to track your wellness journey automatically
          </p>
        </motion.div>

        {/* Device Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Fitbit Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-tulsi-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Watch className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Fitbit</CardTitle>
                      <CardDescription>Sync fitness and health data</CardDescription>
                    </div>
                  </div>
                  {deviceStatus?.fitbitConnected ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={deviceStatus?.fitbitConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {deviceStatus?.fitbitConnected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  
                  {deviceStatus?.fitbitConnected && deviceStatus.lastSyncAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Sync</span>
                      <span className="text-sm text-tulsi-600">{formatDate(deviceStatus.lastSyncAt)}</span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {deviceStatus?.fitbitConnected ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncData.mutate()}
                          disabled={syncData.isPending}
                          className="flex-1"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${syncData.isPending ? 'animate-spin' : ''}`} />
                          Sync Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => disconnectDevice.mutate('fitbit')}
                          disabled={disconnectDevice.isPending}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => connectFitbit.mutate()}
                        disabled={connectFitbit.isPending}
                      >
                        Connect Fitbit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Apple Health Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-tulsi-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Apple Health</CardTitle>
                      <CardDescription>iPhone health data integration</CardDescription>
                    </div>
                  </div>
                  {deviceStatus?.appleHealthConnected ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-orange-100 text-orange-700">
                      Coming Soon
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Apple Health integration will be available soon. Connect via the iOS app when released.
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="w-full"
                  >
                    Connect Apple Health
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Fitness Data */}
        {fitnessData && fitnessData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-tulsi-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Activity Data</CardTitle>
                    <CardDescription>Your latest fitness metrics from connected devices</CardDescription>
                  </div>
                  <Calendar className="w-5 h-5 text-tulsi-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fitnessData.slice(0, 10).map((data) => (
                    <div key={data.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDataTypeIcon(data.dataType)}
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {data.dataType.replace('_', ' ')}: {data.value} {data.unit}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(data.recordedAt)}</p>
                        </div>
                      </div>
                      <Badge className={getDeviceColor(data.deviceType)}>
                        {data.deviceType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {(!fitnessData || fitnessData.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-tulsi-200">
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Fitness Data Yet</h3>
                <p className="text-gray-500 mb-6">
                  Connect your devices and sync data to see your wellness metrics here.
                </p>
                {deviceStatus?.fitbitConnected && (
                  <Button onClick={() => syncData.mutate()} disabled={syncData.isPending}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${syncData.isPending ? 'animate-spin' : ''}`} />
                    Sync Data Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}