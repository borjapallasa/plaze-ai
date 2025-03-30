
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CommunityProductType } from "@/hooks/use-create-community-product";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  productType: z.enum(["free", "paid"], { 
    required_error: "You must select a product type." 
  }),
  price: z.string().optional()
    .refine(val => !val || !isNaN(parseFloat(val)), { 
      message: "Price must be a valid number." 
    })
    .refine(val => !val || parseFloat(val) >= 0, { 
      message: "Price must be positive." 
    }),
  paymentLink: z.string().optional()
    .refine(val => !val || val.trim() === "" || val.startsWith("http"), {
      message: "Payment link must be a valid URL starting with http."
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface CommunityProductFormProps {
  communityId: string;
  communityName: string;
  onSubmit: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CommunityProductForm({
  communityId,
  communityName,
  onSubmit,
  isSubmitting
}: CommunityProductFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productType: "free",
      price: "",
      paymentLink: "",
    },
  });

  const productType = form.watch("productType");
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Link to={`/community/${communityId}`} className="text-sm text-muted-foreground flex items-center hover:text-primary mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {communityName}
        </Link>
        <CardTitle className="text-2xl">Add a Product to Your Community</CardTitle>
        <CardDescription>
          Create a new product for your community members. Products can be free resources or paid offerings.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Premium Ebook, Resource Pack, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <FormLabel htmlFor="free" className="font-normal cursor-pointer">
                          Free
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="paid" />
                        <FormLabel htmlFor="paid" className="font-normal cursor-pointer">
                          Paid
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {productType === "paid" && (
              <>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="19.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Link (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://your-payment-provider.com/buy/your-product" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
