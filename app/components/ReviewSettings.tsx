import { useState, useCallback, useEffect } from 'react';
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
    Popover
} from '@shopify/polaris';
import { SaveBar } from '@shopify/app-bridge-react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { QuestionCircleIcon } from '@shopify/polaris-icons';

export default function SettingsComponent() {
    const shopify = useAppBridge();
    
    // Form state
    const [selectedWidget, setSelectedWidget] = useState(['reviews-widget']);
    const [starShape, setStarShape] = useState('pointed');
    const [starColor, setStarColor] = useState({ hue: 120, brightness: 1, saturation: 1 });
    const [sortOrder, setSortOrder] = useState('newest');
    const [colorHex, setColorHex] = useState(hsbToHex({ hue: 0, brightness: 0, saturation: 1 }));
    const [colorPickerActive, setColorPickerActive] = useState(false);
    const [maxReviews, setMaxReviews] = useState('5');
    const [excerptLength, setExcerptLength] = useState('150');
    
    // Save state management
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Original values for comparison
    const [originalValues, setOriginalValues] = useState({
        selectedWidget: ['reviews-widget'],
        starShape: 'pointed',
        starColor: { hue: 120, brightness: 1, saturation: 1 },
        sortOrder: 'newest',
        maxReviews: '5',
        excerptLength: '150'
    });

    // Check for changes
    const checkForChanges = useCallback(() => {
        const currentValues = {
            selectedWidget,
            starShape,
            starColor,
            sortOrder,
            maxReviews,
            excerptLength
        };

        const hasChanges = JSON.stringify(currentValues) !== JSON.stringify(originalValues);
        setHasUnsavedChanges(hasChanges);
        
        // Show/hide save bar based on changes
        if (hasChanges) {
            shopify.saveBar.show('settings-save-bar');
        } else {
            shopify.saveBar.hide('settings-save-bar');
        }
    }, [selectedWidget, starShape, starColor, sortOrder, maxReviews, excerptLength, originalValues, shopify.saveBar]);

    // Check for changes whenever state updates
    useEffect(() => {
        checkForChanges();
    }, [checkForChanges]);

    // API call to save settings
    const saveSettings = async () => {
        try {
            setIsSaving(true);

            // Simulate API call - replace with your actual API endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ success: true })
                    });
                }, 1000);
            });

            // For real implementation, uncomment and modify this:
            /*
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    widget: selectedWidget[0],
                    starShape,
                    starColor,
                    sortOrder,
                    maxReviews: parseInt(maxReviews),
                    excerptLength: parseInt(excerptLength),
                    colorHex
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }
            */

            // Update original values to current values
            setOriginalValues({
                selectedWidget: [...selectedWidget],
                starShape,
                starColor: { ...starColor },
                sortOrder,
                maxReviews,
                excerptLength
            });

            setHasUnsavedChanges(false);
            
            // Hide save bar after successful save
            shopify.saveBar.hide('settings-save-bar');
            
            // Show success toast
            shopify.toast.show('Settings saved successfully!');

        } catch (error) {
            console.error('Save error:', error);
            
            // Show error toast
            shopify.toast.show('Failed to save settings. Please try again.', { isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle save action
    const handleSave = useCallback(() => {
        saveSettings();
    }, [selectedWidget, starShape, starColor, sortOrder, maxReviews, excerptLength, colorHex]);

    // Handle discard action
    const handleDiscard = useCallback(() => {
        // Reset to original values
        setSelectedWidget([...originalValues.selectedWidget]);
        setStarShape(originalValues.starShape);
        setStarColor({ ...originalValues.starColor });
        setSortOrder(originalValues.sortOrder);
        setMaxReviews(originalValues.maxReviews);
        setExcerptLength(originalValues.excerptLength);
        setColorHex(hsbToHex(originalValues.starColor));
        
        setHasUnsavedChanges(false);
        
        // Hide save bar after discard
        shopify.saveBar.hide('settings-save-bar');
    }, [originalValues, shopify.saveBar]);

    const handleWidgetChange = useCallback((selected:any) => {
        setSelectedWidget(selected);
    }, []);

    const handleStarShapeChange = useCallback((shape:any) => {
        setStarShape(shape);
    }, []);

    const handleColorChange = useCallback((color:any) => {
        setStarColor(color);
        setColorHex(hsbToHex(color));
    }, []);

    const handleSortOrderChange = useCallback((value:any) => {
        setSortOrder(value);
    }, []);

    const handleMaxReviewsChange = useCallback((value:any) => {
        setMaxReviews(value);
    }, []);

    const handleExcerptLengthChange = useCallback((value:any) => {
        setExcerptLength(value);
    }, []);

    const handleColorHexChange = useCallback((value:any) => {
        setColorHex(value);
        // Try to parse and update color picker if valid hex
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            // Convert hex to HSB for color picker
            // This is a simplified conversion - you might want to use a proper color library
            try {
                const r = parseInt(value.slice(1, 3), 16) / 255;
                const g = parseInt(value.slice(3, 5), 16) / 255;
                const b = parseInt(value.slice(5, 7), 16) / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const diff = max - min;
                
                let h = 0;
                if (diff !== 0) {
                    if (max === r) h = ((g - b) / diff) % 6;
                    else if (max === g) h = (b - r) / diff + 2;
                    else h = (r - g) / diff + 4;
                }
                h = Math.round(h * 60);
                if (h < 0) h += 360;
                
                const s = max === 0 ? 0 : diff / max;
                const v = max;
                
                setStarColor({ hue: h, saturation: s, brightness: v });
            } catch (e) {
                // Invalid hex, don't update color picker
            }
        }
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
                                                onChange={handleColorHexChange}
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
                                        value={maxReviews}
                                        onChange={handleMaxReviewsChange}
                                        type="number"
                                        helpText="Maximum number of reviews to display in the widget"
                                        autoComplete=""
                                    />

                                    <TextField
                                        label="Review excerpt length"
                                        value={excerptLength}
                                        onChange={handleExcerptLengthChange}
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
            {/* Shopify App Bridge SaveBar */}
            <SaveBar id="settings-save-bar" discardConfirmation>
                <button variant="primary" onClick={handleSave} disabled={isSaving} loading={isSaving ? "" : undefined}>
                    Save
                </button>
                <button onClick={handleDiscard} disabled={isSaving}>
                    Discard
                </button>
            </SaveBar>
            
            <div style={{ display: 'flex', width: '100%' }}>
                {renderSidebar()}
                
                <div style={{ flex: 1, paddingLeft: '12px' }}>
                    {renderMainContent()}
                </div>
            </div>
        </div>
    );
}