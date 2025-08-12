import React from 'react';
import { CommunitySubscriptionCheckout } from '@/components/checkout/CommunitySubscriptionCheckout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CommunitySubscriptionTest: React.FC = () => {
  const navigate = useNavigate();

  // Mock community data for testing
  const mockCommunity = {
    community_uuid: 'test-community-123',
    name: 'Premium Design Community',
    description: 'Join our exclusive community of designers and creators. Get access to premium resources, mentorship, and networking opportunities.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop&crop=faces',
  };

  // Mock pricing data for testing
  const mockPricing = {
    community_price_uuid: 'price-123',
    amount: 29.99,
    currency: 'usd',
    billing_period: 'monthly' as const,
    stripe_price_id: 'price_test_subscription', // This would be a real Stripe Price ID in production
  };

  const handleSuccess = (data: {
    subscriptionId: string;
    communityId: string;
    customerEmail: string;
  }) => {
    console.log('Subscription successful:', data);
    toast.success(`Successfully subscribed to ${mockCommunity.name}!`);
    
    // In a real app, you'd redirect to the community page
    // navigate(`/community/${data.communityId}`);
  };

  const handleCancel = () => {
    console.log('Subscription cancelled');
    navigate('/communities'); // Or back to community list
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Community Subscription Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the community subscription checkout flow
          </p>
        </div>

        <CommunitySubscriptionCheckout
          community={mockCommunity}
          pricing={mockPricing}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CommunitySubscriptionTest;