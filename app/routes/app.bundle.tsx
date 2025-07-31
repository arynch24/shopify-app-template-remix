import {
    Page,
    Box,
    Card,
    Grid,
    InlineStack,
    Icon,
    Text,
    Badge,
} from '@shopify/polaris';
import { StarIcon, PackageIcon } from '@shopify/polaris-icons';
import { useNavigate } from '@remix-run/react';

export default function AppList() {
    const apps = [
        {
            id: 'reviews',
            title: 'Product Reviews',
            description:
                'Product Reviews app allows you to easily manage and showcase customer feedback on your products.',
            active: true,
            icon: StarIcon,
            navigate: 'product_reviews/dashboard',
        },
        {
            id: 'sticky',
            title: 'Sticky Add to Cart',
            description:
                'Boost your conversion rate with Sticky Add to Cart. It allows customers to add products to their cart without leaving the page.',
            active: false,
            icon: PackageIcon,
            navigate: 'sticky_add_to_cart/dashboard',
        },
    ];

    const navigate = useNavigate();

    return (
        <Page title="Stickyfy Apps" >
            <Box>
                <Grid columns={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                    {apps.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => navigate(`/app/${app.navigate}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card          >
                                <InlineStack align="space-between" blockAlign="center" gap="200">
                                    {/* Left section: Icon + text */}
                                    <InlineStack gap="200" blockAlign="center">
                                        <Icon source={app.icon} tone="subdued" />
                                        <Box>
                                            <Text variant="bodyLg" as="h6" fontWeight="medium">
                                                {app.title}
                                            </Text>
                                            <Text variant="bodySm" as="h5" tone="subdued">
                                                {app.description}
                                            </Text>
                                        </Box>
                                    </InlineStack>

                                    {/* Right section: Status */}
                                    <Badge tone={app.active ? 'success' : 'critical'}>
                                        {app.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </InlineStack>
                            </Card>
                        </div>
                    ))}
                </Grid>
            </Box>
        </Page>
    );
}