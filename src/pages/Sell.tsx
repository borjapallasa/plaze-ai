
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  UserCog, 
  Users,
  Home,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { CATEGORIES, SUBCATEGORIES, CategoryType, SERVICE_TYPES, ServiceType } from "@/constants/service-categories";

const SellPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sellType: "",
    name: "",
    description: "",
    contactEmail: "",
    servicePrice: "",
    serviceType: "one time" as ServiceType,
    category: "" as CategoryType | "",
    selectedSubcategories: [] as string[],
    communityType: "free" as "free" | "paid",
    communityPrice: "",
    thumbnail: ""
  });
  const navigate = useNavigate();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, sellType: option }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Final step - navigate based on selection
      if (selectedOption === "services") {
        navigate("/seller/services/new", { 
          state: { 
            name: formData.name,
            description: formData.description,
            price: formData.servicePrice,
            type: formData.serviceType,
            category: formData.category ? { value: formData.category } : null,
            subcategory: formData.selectedSubcategories.length > 0 
              ? formData.selectedSubcategories.map(sub => ({ value: sub })) 
              : null
          } 
        });
      } else if (selectedOption === "products") {
        navigate("/seller/products/new");
      } else if (selectedOption === "community") {
        navigate("/seller/communities/new", {
          state: {
            name: formData.name,
            description: formData.description,
            price: formData.communityPrice,
            type: formData.communityType,
            thumbnail: formData.thumbnail
          }
        });
      }
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: CategoryType) => {
    setFormData(prev => ({ 
      ...prev, 
      category: value,
      selectedSubcategories: []
    }));
  };

  const handleSubcategoriesChange = (value: string) => {
    if (!formData.selectedSubcategories.includes(value)) {
      setFormData(prev => ({
        ...prev,
        selectedSubcategories: [...prev.selectedSubcategories, value]
      }));
    }
  };

  const handleRemoveSubcategory = (value: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSubcategories: prev.selectedSubcategories.filter(item => item !== value)
    }));
  };

  const handleServiceTypeChange = (value: ServiceType) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  };
  
  const handleCommunityTypeChange = (value: "free" | "paid") => {
    setFormData(prev => ({ ...prev, communityType: value }));
  };

  console.log("Current Step:", currentStep);
  console.log("Selected Option:", selectedOption);
  console.log("Form Data:", formData);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center">
          <Home className="h-6 w-6" />
        </Link>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-sm">
                Questions?
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about the onboarding process, please check our FAQ or contact support.
                </p>
                <Button variant="outline" className="w-full" onClick={() => window.open('mailto:support@plaze.com')}>
                  Contact Support
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="text-sm" onClick={() => navigate("/")}>
            Save & exit
          </Button>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="border-b">
        <div className="max-w-3xl mx-auto py-4 px-4 md:px-0">
          <div className="flex items-center justify-between">
            <Tabs value={currentStep.toString()} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger 
                  value="1" 
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                  disabled
                >
                  Choose Type
                </TabsTrigger>
                <TabsTrigger 
                  value="2" 
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                  disabled
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="3" 
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                  disabled
                >
                  Confirmation
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-3xl mx-auto w-full">
        <div className="w-full space-y-8">
          {/* Step 1: Choose what to sell */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  What would you use Plaze for?
                </h1>
              </div>

              <div className="space-y-4">
                <Card
                  className={`p-4 flex items-center border hover:border-primary cursor-pointer transition-all ${
                    selectedOption === "services"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleOptionSelect("services")}
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Sell my services</h3>
                    <p className="text-sm text-gray-600">
                      Offer consulting, support, or custom services to clients
                    </p>
                  </div>
                  <div className="ml-4 p-2 rounded-full bg-blue-50 text-blue-600">
                    <UserCog size={24} />
                  </div>
                </Card>

                <Card
                  className={`p-4 flex items-center border hover:border-primary cursor-pointer transition-all ${
                    selectedOption === "products"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleOptionSelect("products")}
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Sell my products</h3>
                    <p className="text-sm text-gray-600">
                      Sell digital products, templates, or code assets
                    </p>
                  </div>
                  <div className="ml-4 p-2 rounded-full bg-green-50 text-green-600">
                    <ShoppingBag size={24} />
                  </div>
                </Card>

                <Card
                  className={`p-4 flex items-center border hover:border-primary cursor-pointer transition-all ${
                    selectedOption === "community"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleOptionSelect("community")}
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Run my community</h3>
                    <p className="text-sm text-gray-600">
                      Create and manage a community around your expertise
                    </p>
                  </div>
                  <div className="ml-4 p-2 rounded-full bg-purple-50 text-purple-600">
                    <Users size={24} />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Basic information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Tell us a bit about your {selectedOption === "services" ? "service" : 
                                            selectedOption === "products" ? "product" : 
                                            "community"}
                </h1>
                <p className="text-gray-600">
                  This information helps us prepare your setup
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder={`Your ${selectedOption === "services" ? "service" : 
                                  selectedOption === "products" ? "product" : 
                                  "community"} name`}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Brief Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Describe what you're offering"
                  />
                </div>

                {selectedOption === "services" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700">
                        Price
                      </Label>
                      <Input
                        type="number"
                        id="servicePrice"
                        name="servicePrice"
                        value={formData.servicePrice}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                        Service Type
                      </Label>
                      <Select 
                        value={formData.serviceType} 
                        onValueChange={handleServiceTypeChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <ServiceCategories
                      category={formData.category}
                      selectedSubcategories={formData.selectedSubcategories}
                      onCategoryChange={handleCategoryChange}
                      onSubcategoriesChange={handleSubcategoriesChange}
                      onRemoveSubcategory={handleRemoveSubcategory}
                    />
                  </>
                )}

                {selectedOption === "community" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="communityType" className="block text-sm font-medium text-gray-700">
                        Community Type
                      </Label>
                      <Select 
                        value={formData.communityType} 
                        onValueChange={handleCommunityTypeChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select community type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.communityType === "paid" && (
                      <div className="space-y-2">
                        <Label htmlFor="communityPrice" className="block text-sm font-medium text-gray-700">
                          Price
                        </Label>
                        <Input
                          type="number"
                          id="communityPrice"
                          name="communityPrice"
                          value={formData.communityPrice}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                        Thumbnail URL (optional)
                      </Label>
                      <Input
                        type="text"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </>
                )}

                {selectedOption !== "services" && selectedOption !== "community" && (
                  <div className="space-y-2">
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Ready to create your {selectedOption === "services" ? "service" : 
                                  selectedOption === "products" ? "product" : 
                                  "community"}?
                </h1>
                <p className="text-gray-600">
                  Here's a summary of what you're about to create:
                </p>
              </div>

              <Card className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Type</h3>
                  <p className="text-gray-700">
                    {selectedOption === "services" ? "Service" : 
                     selectedOption === "products" ? "Product" : 
                     "Community"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Name</h3>
                  <p className="text-gray-700">{formData.name || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-700">{formData.description || "Not specified"}</p>
                </div>

                {selectedOption === "services" ? (
                  <>
                    <div>
                      <h3 className="font-medium text-gray-900">Price</h3>
                      <p className="text-gray-700">${formData.servicePrice || "0.00"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Service Type</h3>
                      <p className="text-gray-700">{SERVICE_TYPES.find(t => t.value === formData.serviceType)?.label || "One Time"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Category</h3>
                      <p className="text-gray-700">
                        {formData.category ? CATEGORIES.find(c => c.value === formData.category)?.label : "Not specified"}
                      </p>
                    </div>
                    {formData.selectedSubcategories.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900">Subcategories</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.selectedSubcategories.map(sub => (
                            <span key={sub} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                              {formData.category && 
                                CATEGORIES.find(c => c.value === formData.category) &&
                                SUBCATEGORIES[formData.category as CategoryType].find(s => s.value === sub)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : selectedOption === "community" ? (
                  <>
                    <div>
                      <h3 className="font-medium text-gray-900">Community Type</h3>
                      <p className="text-gray-700">{formData.communityType === "free" ? "Free" : "Paid"}</p>
                    </div>
                    {formData.communityType === "paid" && (
                      <div>
                        <h3 className="font-medium text-gray-900">Price</h3>
                        <p className="text-gray-700">${formData.communityPrice || "0.00"}</p>
                      </div>
                    )}
                    {formData.thumbnail && (
                      <div>
                        <h3 className="font-medium text-gray-900">Thumbnail</h3>
                        <p className="text-gray-700">{formData.thumbnail}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Email</h3>
                    <p className="text-gray-700">{formData.contactEmail || "Not specified"}</p>
                  </div>
                )}
              </Card>

              <p className="text-sm text-gray-600 text-center">
                Click "Next" to continue to the detailed creation process.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 border-t bg-white">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={
              (currentStep === 1 && !selectedOption) ||
              (currentStep === 2 && (
                !formData.name || 
                !formData.description || 
                (selectedOption === "services" 
                  ? !formData.servicePrice || !formData.category 
                  : selectedOption === "community"
                    ? (formData.communityType === "paid" && !formData.communityPrice)
                    : !formData.contactEmail
                )
              ))
            }
          >
            {currentStep === 3 ? "Continue" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SellPage;
