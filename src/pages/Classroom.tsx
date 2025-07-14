import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, Edit, Trash, Plus, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DataTableSearchProps {
  table: any;
}

function DataTableSearch({ table }: DataTableSearchProps) {
  const [isAscending, setIsAscending] = useState(true);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={() => {
            table.toggleSorting(table.getColumn("name")?.id, !isAscending);
            setIsAscending(!isAscending);
          }}
        >
          Sort by Name ({isAscending ? "Asc" : "Desc"})
        </Button>
      </div>
      <div className="flex items-center">
        <Select
          onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

interface DateRangePickerProps {
  table: any;
}

function DateRangePicker({ table }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 20),
  })

  useEffect(() => {
    if (date?.from && date?.to) {
      table.getColumn("created_at")?.setFilterValue([
        date.from.toLocaleDateString(),
        date.to.toLocaleDateString(),
      ])
    }
  }, [date?.from, date?.to, table])

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            pagedNavigation
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

interface Product {
  product_uuid: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  community_product_uuid: string | null;
}

export default function Classroom() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAscending, setIsAscending] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [isProductDeleteDialogOpen, setIsProductDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select('*');

      if (selectedCommunity) {
        query = query.eq('community_uuid', selectedCommunity);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setProducts(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setCommunities(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCommunities();
  }, [selectedCommunity]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleSortChange = () => {
    setIsAscending(!isAscending);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const filteredProducts = products.filter((product) => {
    const searchRegex = new RegExp(search, 'i');
    const nameMatch = searchRegex.test(product.name);
    const descriptionMatch = searchRegex.test(product.description);
    const statusMatch = selectedStatus ? product.status === selectedStatus : true;

    let dateMatch = true;
    if (dateRange?.from && dateRange?.to) {
      const productDate = new Date(product.created_at);
      dateMatch = productDate >= dateRange.from && productDate <= dateRange.to;
    }

    return nameMatch || descriptionMatch && statusMatch && dateMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (isAscending) {
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    } else {
      if (nameA > nameB) return -1;
      if (nameA < nameB) return 1;
      return 0;
    }
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Product ID copied to clipboard",
    })
  };

  const handleEditProduct = (product_uuid: string) => {
    navigate(`/edit-product/${product_uuid}`);
  };

  const handleDeleteProduct = (product_uuid: string) => {
    setProductToDelete(product_uuid);
    setIsProductDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_uuid', productToDelete);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        setProducts(products.filter(product => product.product_uuid !== productToDelete));
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsProductDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDeleteProduct = () => {
    setIsProductDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCommunityChange = (communityUuid: string) => {
    setSelectedCommunity(communityUuid);
  };

  const { data: communitiesData } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Classroom Products</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage products associated with your classroom</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="max-w-sm"
              />

              <div className="flex items-center space-x-2">
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={handleSortChange}>
                  Sort by Name ({isAscending ? "Asc" : "Desc"})
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-[200px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                      pagedNavigation
                    />
                  </PopoverContent>
                </Popover>

                <Select onValueChange={handleCommunityChange}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filter by Community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Communities</SelectItem>
                    {communitiesData?.map((community) => (
                      <SelectItem key={community.community_uuid} value={community.community_uuid}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : sortedProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.map((product) => (
                      <TableRow key={product.product_uuid}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'active' ? 'success' : product.status === 'inactive' ? 'secondary' : 'outline'}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(product.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => copyToClipboard(product.product_uuid)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Product ID
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.product_uuid)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteProduct(product.product_uuid)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isProductDeleteDialogOpen} onOpenChange={setIsProductDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteProduct}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
