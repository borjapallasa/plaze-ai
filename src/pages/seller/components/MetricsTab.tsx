
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Eye, Repeat } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export function MetricsTab() {
  const isMobile = useIsMobile();
  
  // Mock data - in a real app, this would come from props or API
  const metrics = {
    totalRevenue: 15420,
    totalSales: 127,
    totalViews: 3542,
    conversionRate: 3.6,
    monthlyRecurringRevenue: 8750,
    revenueChange: 12.5,
    salesChange: -4.2,
    viewsChange: 8.7,
    conversionChange: 2.1,
    mrrChange: 18.3
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

  const mrrData = [
    { month: 'Jan', mrr: 6200 },
    { month: 'Feb', mrr: 6800 },
    { month: 'Mar', mrr: 7100 },
    { month: 'Apr', mrr: 7650 },
    { month: 'May', mrr: 8200 },
    { month: 'Jun', mrr: 8750 }
  ];

  const trafficData = [
    { source: 'Direct', value: 35, color: '#3b82f6' },
    { source: 'Search', value: 28, color: '#10b981' },
    { source: 'Social', value: 22, color: '#f59e0b' },
    { source: 'Referral', value: 15, color: '#ef4444' }
  ];

  const productSalesData = [
    { name: 'UI Kit Pro', sales: 45, revenue: 4500, color: '#3b82f6' },
    { name: 'Design System', sales: 32, revenue: 3200, color: '#10b981' },
    { name: 'Landing Templates', sales: 28, revenue: 2800, color: '#f59e0b' },
    { name: 'React Components', sales: 22, revenue: 2200, color: '#ef4444' },
    { name: 'Icon Pack', sales: 18, revenue: 1800, color: '#8b5cf6' }
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
    mrr: {
      label: "MRR",
      color: "#8b5cf6",
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
      {/* KPI Cards - Responsive Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
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
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(metrics.monthlyRecurringRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(metrics.mrrChange)}
              <span className={`ml-1 ${getTrendColor(metrics.mrrChange)}`}>
                {metrics.mrrChange > 0 ? '+' : ''}{metrics.mrrChange}%
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
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(metrics.totalSales)}</div>
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
            <div className="text-xl sm:text-2xl font-bold">{formatNumber(metrics.totalViews)}</div>
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
            <div className="text-xl sm:text-2xl font-bold">{metrics.conversionRate}%</div>
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
      <div className="space-y-6">
        {/* Revenue & Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Sales Trend</CardTitle>
            <CardDescription>Monthly revenue and sales over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* MRR Chart */}
        <Card>
          <CardHeader>
            <CardTitle>MRR Evolution</CardTitle>
            <CardDescription>Monthly recurring revenue growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mrrData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="mrr" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="MRR ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Two Column Layout for Desktop, Single Column for Mobile */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Distribution of traffic sources this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Product Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Distribution</CardTitle>
              <CardDescription>Sales performance by product</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={productSalesData} 
                    layout="horizontal" 
                    margin={{ top: 5, right: 30, left: isMobile ? 60 : 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={isMobile ? 50 : 70} fontSize={isMobile ? 10 : 12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Revenue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Product Revenue Distribution</CardTitle>
              <CardDescription>Revenue breakdown by product</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productSalesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {productSalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Performance */}
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MRR Growth</span>
                  <Badge variant="secondary">+18.3%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Cards */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Your best selling products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productSalesData.slice(0, 3).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate mr-2">{product.name}</span>
                    <span className="text-sm text-muted-foreground flex-shrink-0">{product.sales} sales</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Insights</CardTitle>
              <CardDescription>Key metrics from your communities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Communities</span>
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Members</span>
                  <span className="text-sm font-bold">413</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Paid Members</span>
                  <span className="text-sm font-bold">219</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Community MRR</span>
                  <span className="text-sm font-bold">{formatCurrency(metrics.monthlyRecurringRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
