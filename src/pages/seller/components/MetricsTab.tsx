
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Star } from "lucide-react";

interface MetricsTabProps {
  seller: any;
  mode?: 'seller' | 'admin';
}

export function MetricsTab({ seller, mode = 'seller' }: MetricsTabProps) {
  // Mock data for metrics - replace with actual data
  const metrics = {
    totalRevenue: seller.sales_amount || 0,
    totalSales: 45,
    conversionRate: 3.2,
    averageOrderValue: 89.50,
    revenueGrowth: 12.5,
    salesGrowth: 8.3,
    customerCount: 127,
    repeatCustomers: 34
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    prefix = "", 
    suffix = "",
    isPositive = true 
  }: {
    title: string;
    value: number | string;
    change?: number;
    icon: any;
    prefix?: string;
    suffix?: string;
    isPositive?: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          change={metrics.revenueGrowth}
          icon={DollarSign}
          prefix="$"
          isPositive={true}
        />
        
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales}
          change={metrics.salesGrowth}
          icon={ShoppingCart}
          isPositive={true}
        />
        
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate}
          change={0.5}
          icon={TrendingUp}
          suffix="%"
          isPositive={true}
        />
        
        <MetricCard
          title="Avg. Order Value"
          value={metrics.averageOrderValue}
          change={-2.1}
          icon={DollarSign}
          prefix="$"
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Customers</span>
              </div>
              <span className="text-lg font-bold">{metrics.customerCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Repeat Customers</span>
              </div>
              <span className="text-lg font-bold">{metrics.repeatCustomers}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Customer Satisfaction</span>
              </div>
              <span className="text-lg font-bold">{seller.client_satisfaction || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue Growth</span>
                <span className="font-medium">+{metrics.revenueGrowth}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(metrics.revenueGrowth * 4, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sales Growth</span>
                <span className="font-medium">+{metrics.salesGrowth}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(metrics.salesGrowth * 6, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate</span>
                <span className="font-medium">{metrics.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(metrics.conversionRate * 10, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
