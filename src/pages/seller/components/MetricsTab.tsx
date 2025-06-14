
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Eye } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export function MetricsTab() {
  // Mock data - in a real app, this would come from props or API
  const metrics = {
    totalRevenue: 15420,
    totalSales: 127,
    totalViews: 3542,
    conversionRate: 3.6,
    revenueChange: 12.5,
    salesChange: -4.2,
    viewsChange: 8.7,
    conversionChange: 2.1
  };

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 8500, sales: 45 },
    { month: 'Feb', revenue: 12200, sales: 67 },
    { month: 'Mar', revenue: 9800, sales: 52 },
    { month: 'Apr', revenue: 14300, sales: 78 },
    { month: 'May', revenue: 11900, sales: 63 },
    { month: 'Jun', revenue: 15420, sales: 85 }
  ];

  const trafficData = [
    { source: 'Direct', value: 35, color: '#3b82f6' },
    { source: 'Search', value: 28, color: '#10b981' },
    { source: 'Social', value: 22, color: '#f59e0b' },
    { source: 'Referral', value: 15, color: '#ef4444' }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
    sales: {
      label: "Sales",
      color: "#10b981",
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(metrics.revenueChange)}
              <span className={`ml-1 ${getTrendColor(metrics.revenueChange)}`}>
                {metrics.revenueChange > 0 ? '+' : ''}{metrics.revenueChange}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalSales)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(metrics.salesChange)}
              <span className={`ml-1 ${getTrendColor(metrics.salesChange)}`}>
                {metrics.salesChange > 0 ? '+' : ''}{metrics.salesChange}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalViews)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(metrics.viewsChange)}
              <span className={`ml-1 ${getTrendColor(metrics.viewsChange)}`}>
                {metrics.viewsChange > 0 ? '+' : ''}{metrics.viewsChange}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(metrics.conversionChange)}
              <span className={`ml-1 ${getTrendColor(metrics.conversionChange)}`}>
                {metrics.conversionChange > 0 ? '+' : ''}{metrics.conversionChange}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Sales Trend</CardTitle>
            <CardDescription>Monthly revenue and sales over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-revenue)" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--color-sales)" 
                  strokeWidth={2}
                  name="Sales"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Distribution of traffic sources this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Your performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Product Views</span>
                <Badge variant="secondary">+8.7%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sales Conversion</span>
                <Badge variant="secondary">+2.1%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <Badge variant="secondary">4.9/5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">UI Kit Pro</span>
                <span className="text-sm text-muted-foreground">45 sales</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Design System</span>
                <span className="text-sm text-muted-foreground">32 sales</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Landing Templates</span>
                <span className="text-sm text-muted-foreground">28 sales</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
