import { Page, Banner, Tabs, Card, Layout, Button, Icon } from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';
import { useSearchParams } from '@remix-run/react';
import { useState, useCallback } from 'react';
import ReviewSetting from '../components/ReviewSettings';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(0);

  const shop = searchParams.get("shop");

  const apiKey = "d73ce3a561b2b0a36cdd9beb041e8832";
  const handle = "review_app";
  const template = "product";
  const target = "section";

  const deeplink = `https://${shop}/admin/themes/current/editor?template=${template}&addAppBlockId=${apiKey}/${handle}&target=${target}`;

  const handleTabChange = useCallback((selectedTabIndex: any) => {
    setSelectedTab(selectedTabIndex);
  }, []);

  const tabs = [
    {
      id: 'dashboard',
      content: 'Dashboard',
      accessibilityLabel: 'Dashboard tab',
      panelID: 'dashboard-content',
    },
    {
      id: 'reviews',
      content: 'Reviews',
      accessibilityLabel: 'Reviews tab',
      panelID: 'reviews-content',
    },
    {
      id: 'settings',
      content: 'Settings',
      accessibilityLabel: 'Settings tab',
      panelID: 'settings-content',
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0: // Dashboard
        return (
          <>
            <Layout>
              <Layout.Section>
                <Card >
                  <h2>Popular Actions</h2>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ marginRight: '12px' }}>
                        <Icon source={ViewIcon} />
                      </div>
                      <div>
                        <h3>See reviews</h3>
                        <p>See all products with reviews.</p>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedTab(1)}>See Reviews</Button>
                  </div>
                </Card>
              </Layout.Section>
            </Layout>
          </>
        );
      case 1: // Reviews
        return (
          <Layout>
            <Layout.Section>
              <Card >
                <h2>Reviews</h2>
                <p>Manage and view all product reviews here.</p>
              </Card>
            </Layout.Section>
          </Layout>
        );
      case 2: // Moderation
        return (
            <ReviewSetting />
        );
      default:
        return null;
    }
  };

  return (
    <Page
      title="Product Reviews"
      primaryAction={{
        content: 'Activate in Storefront',
        onAction: () => {
          window.open(deeplink, '_blank');
        },
      }}
    >
      <div style={{ paddingBottom: '12px' }}>

        <Banner title="Manage App Block in Storefront">
          <p >
            Click "Activate" to insert the app block into the product page.
          </p>
        </Banner>
      </div>

      <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
        <div style={{ marginTop: '12px' }}>
          {renderTabContent()}
        </div>
      </Tabs>
    </Page>
  );
}