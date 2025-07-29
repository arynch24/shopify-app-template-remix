import {
    Page,
    Layout,
    TextField,
    ColorPicker,
    Card,
    Button,
  } from '@shopify/polaris';
  import type { LoaderFunction, ActionFunction } from '@remix-run/node';
  import { useLoaderData, useSubmit } from '@remix-run/react';
  import { getSessionShop } from '../../utils/auth.server';
  import prisma from '../db.server';
  import { useState } from 'react';
  import { hsbToRgb, rgbToHsb } from '@shopify/polaris';

  // --- Types ---
type RGB = { red: number; green: number; blue: number };
type HSB = { hue: number; saturation: number; brightness: number };
  
  // --- Server Load ---
  export const loader: LoaderFunction = async ({ request }) => {
    const shop = await getSessionShop(request);
    const settings = await prisma.shopSetting.findUnique({ where: { shop } });
  
    const payload = {
      shop,
      primaryColor: settings?.primaryColor ?? '#000000',
      fontSize: settings?.fontSize ?? 16,
    };
  
    return new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });
  };
  
  // --- Server Submit ---
  export const action: ActionFunction = async ({ request }) => {
    const shop = await getSessionShop(request);
    const formData = await request.formData();
  
    const primaryColor = formData.get('primaryColor') as string;
    const fontSize = parseInt(formData.get('fontSize') as string, 10);
  
    const isValidHex = /^#([0-9A-Fa-f]{6})$/.test(primaryColor);
    const finalColor = isValidHex ? primaryColor : '#000000';
    const finalFontSize = Number.isFinite(fontSize) ? fontSize : 16;
  
    await prisma.shopSetting.upsert({
      where: { shop },
      update: { primaryColor: finalColor, fontSize: finalFontSize },
      create: { shop, primaryColor: finalColor, fontSize: finalFontSize },
    });
  
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  };
  
  // --- React Component ---
  export default function Settings() {
    const data = useLoaderData<typeof loader>();
    const submit = useSubmit();
  
    const [color, setColor] = useState<HSB>(rgbToHsb(hexToRgb(data.primaryColor)));
    const [hexInput, setHexInput] = useState<string>(data.primaryColor);
    const [fontSize, setFontSize] = useState<number>(data.fontSize);

    const handleColorChange = (newColor: HSB) => {
        setColor(newColor);
        const rgb = hsbToRgb(newColor);
        setHexInput(rgbToHex(rgb));
      };
  
      const handleHexChange = (value: string) => {
        setHexInput(value);
      
        const isValid = /^#([0-9A-Fa-f]{6})$/.test(value);
        if (isValid) {
          try {
            const rgb = hexToRgb(value);
            setColor(rgbToHsb(rgb));
          } catch {
            // ignore
          }
        }
      };
      
  
    const handleSubmit = () => {
      const formData = new FormData();
      formData.append('primaryColor', hexInput);
      formData.append('fontSize', fontSize.toString());
      submit(formData, { method: 'post' });
    };
  
    return (
      <Page title="Widget Settings">
        <Layout>
          <Layout.Section>
            <Card >
              <ColorPicker color={color} onChange={handleColorChange} />
  
              <TextField
                label="Hex Color Code"
                value={hexInput}
                onChange={handleHexChange}
                autoComplete="off"
                helpText="Enter 6-digit hex color like #ff6600"
              />
  
              <TextField
                label="Font Size (px)"
                type="number"
                value={fontSize.toString()}
                onChange={(val) => setFontSize(Number(val))}
                autoComplete="off"
              />
  
              <Button  onClick={handleSubmit}>
                Save
              </Button>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  
  
  // --- Helpers ---
  function hexToRgb(hex: string): RGB {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized, 16);
  
    return {
      red: (bigint >> 16) & 255,
      green: (bigint >> 8) & 255,
      blue: bigint & 255,
    };
  }
  
  function rgbToHex({ red, green, blue }: RGB): string {
    return (
      '#' +
      [red, green, blue]
        .map((val) => val.toString(16).padStart(2, '0'))
        .join('')
    );
  }
  