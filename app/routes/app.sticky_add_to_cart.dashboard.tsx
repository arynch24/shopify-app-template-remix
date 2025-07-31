import { Page } from '@shopify/polaris';
import { useSearchParams } from '@remix-run/react';

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const shop = searchParams.get("shop"); // from the OAuth URL
  const apiKey = process.env.SHOPIFY_API_KEY; // set in .env
  const handle = "sticky-cart"; 

  const template = "product"; 
  const target = "section";

  const deeplink = `https://${shop}/admin/themes/current/editor?template=${template}&addAppBlockId=${apiKey}/${handle}&target=${target}`;

  const embedApp = () => {
    window.open(deeplink, "_blank");
  };

  return (
    <Page
      title="Sticky Add to Cart"
      primaryAction={{
        content: 'Activate in Storefront',
        onAction: embedApp,
      }}
    >
      <p>Click activate to insert the app block into your product page.</p>
    </Page>
  );
}
