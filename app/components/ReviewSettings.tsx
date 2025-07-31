import { useState, useCallback } from 'react';
import {
    Layout,
    Card,
    OptionList,
    FormLayout,
    TextField,
    Select,
    Text,
    Box,
    Icon,
    Tooltip,
    ColorPicker,
    hsbToHex,
    Popover,
    Button
} from '@shopify/polaris';
import { QuestionCircleIcon } from '@shopify/polaris-icons';

export default function SettingsComponent() {
    const [selectedWidget, setSelectedWidget] = useState(['reviews-widget']);
    const [starShape, setStarShape] = useState('pointed');
    const [starColor, setStarColor] = useState({ hue: 120, brightness: 1, saturation: 1 });
    const [sortOrder, setSortOrder] = useState('newest');
    const [colorHex, setColorHex] = useState(hsbToHex({ hue: 120, brightness: 1, saturation: 1 }));
    const [colorPickerActive, setColorPickerActive] = useState(false);

    const handleWidgetChange = useCallback((selected: any) => {
        setSelectedWidget(selected);
    }, []);

    const handleStarShapeChange = useCallback((shape: any) => {
        setStarShape(shape);
    }, []);

    const handleColorChange = useCallback((color: any) => {
        setStarColor(color);
        setColorHex(hsbToHex(color));
    }, []);

    const handleSortOrderChange = useCallback((value: any) => {
        setSortOrder(value);
    }, []);

    const toggleColorPicker = useCallback(() => {
        setColorPickerActive(!colorPickerActive);
    }, [colorPickerActive]);

    const widgetOptions = [
        { value: 'reviews-widget', label: 'Reviews Widget' },
        { value: 'star-ratings', label: 'Star Ratings' },
        { value: 'all-reviews-badge', label: 'All Reviews Badge' }
    ];

    const sortOrderOptions = [
        { label: 'Newest first', value: 'newest' },
        { label: 'Oldest first', value: 'oldest' },
        { label: 'Highest rating first', value: 'highest' },
        { label: 'Lowest rating first', value: 'lowest' }
    ];

    const renderSidebar = () => (
        <div style={{ width: '260px', height: '100vh' }}>
            <Card padding="200">
                <OptionList
                    title="Widgets"
                    onChange={handleWidgetChange}
                    options={widgetOptions}
                    selected={selectedWidget}
                />
            </Card>
        </div>
    );

    const renderStarShapeOptions = () => (
        <div style={{ width:'100%', display: 'flex',justifyContent:'space-between', gap: '16px', marginTop: '12px' }}>
            <div
                onClick={() => handleStarShapeChange('rounded')}
                style={{
                    padding: '16px',
                    border: starShape === 'rounded' ? '2px solid #008060' : '1px solid #e1e3e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: starShape === 'rounded' ? '#f0fcf9' : 'white'
                }}
            >
                <div style={{ marginBottom: '8px', fontSize: '44px' }}>★★★★★</div>
                <Text variant="bodyMd" as="h4">Rounded corners</Text>
            </div>

            <div
                onClick={() => handleStarShapeChange('pointed')}
                style={{
                    padding: '16px',
                    border: starShape === 'pointed' ? '2px solid #008060' : '1px solid #e1e3e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: starShape === 'pointed' ? '#f0fcf9' : 'white'
                }}
            >
                <div style={{ marginBottom: '8px', fontSize: '44px' }}>★★★★★</div>
                <Text variant="bodyMd" as="h4" >Pointed corners</Text>
            </div>

            <div
                onClick={() => handleStarShapeChange('hearts')}
                style={{
                    padding: '16px',
                    border: starShape === 'hearts' ? '2px solid #008060' : '1px solid #e1e3e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: starShape === 'hearts' ? '#f0fcf9' : 'white'
                }}
            >
                <div style={{ marginBottom: '12px', fontSize: '44px' }}>♥♥♥♥♥</div>
                <Text variant="bodyMd" as="h4">Hearts</Text>
            </div>
        </div>
    );

    const renderMainContent = () => {
        const currentWidget = selectedWidget[0] || 'reviews-widget';

        if (currentWidget === 'reviews-widget') {
            return (
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Text variant="headingLg" as="h2">General</Text>
                            <Box>
                                <FormLayout>
                                    <div style={{width:'100%'}}>
                                        <div style={{ width:'100%', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <Text variant="headingMd" as="h3">Star shape</Text>
                                            <Tooltip content="Choose the shape for your star ratings">
                                                <Icon source={QuestionCircleIcon} tone="subdued" />
                                            </Tooltip>
                                        </div>
                                        {renderStarShapeOptions()}
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <Text variant="headingMd" as="h3">Star color</Text>
                                            <Tooltip content="Choose the color for your stars">
                                                <Icon source={QuestionCircleIcon} tone="subdued" />
                                            </Tooltip>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Popover
                                                active={colorPickerActive}
                                                activator={
                                                    <div
                                                        onClick={toggleColorPicker}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '8px',
                                                            backgroundColor: colorHex,
                                                            cursor: 'pointer',
                                                            border: '1px solid #e1e3e5'
                                                        }}
                                                    >
                                                    </div>
                                                }
                                                onClose={toggleColorPicker}
                                            >
                                                <div style={{ padding: '16px' }}>
                                                    <ColorPicker
                                                        onChange={handleColorChange}
                                                        color={starColor}
                                                    />
                                                </div>
                                            </Popover>
                                            <TextField
                                                label=""
                                                value={colorHex}
                                                onChange={setColorHex}
                                                placeholder="#222222"
                                                autoComplete=""
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <Select
                                        label="Sort order"
                                        options={sortOrderOptions}
                                        value={sortOrder}
                                        onChange={handleSortOrderChange}
                                    />
                                </FormLayout>
                            </Box>
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <Text variant="headingLg" as="h2">Display Settings</Text>
                            <Box>
                                <FormLayout>
                                    <TextField
                                        label="Maximum reviews to show"
                                        value="5"
                                        type="number"
                                        helpText="Maximum number of reviews to display in the widget"
                                        autoComplete=""
                                    />

                                    <TextField
                                        label="Review excerpt length"
                                        value="150"
                                        type="number"
                                        helpText="Maximum number of characters to show in review previews"
                                        autoComplete=""
                                    />
                                </FormLayout>
                            </Box>
                        </Card>
                    </Layout.Section>
                </Layout>
            );
        }

        // Default content for other widgets
        return (
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text variant="headingLg" as="h2">{currentWidget.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Settings</Text>
                        <Box>
                            <Text variant="bodyMd" as="h4" tone="subdued">
                                Configure settings for {currentWidget.split('-').join(' ')}.
                            </Text>
                        </Box>
                    </Card>
                </Layout.Section>
            </Layout>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {renderSidebar()}
            <div style={{ flex: 1, paddingLeft: '12px' }}>
                {renderMainContent()}
            </div>
        </div>
    );
}