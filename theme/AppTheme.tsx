import type { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import { inputsCustomizations } from './customizations/inputs';
import { navigationCustomizations } from './customizations/navigation';
import { colorSchemes, shadows, shape, typography } from './themePrimitives';

interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
        ? {}
        : createTheme({
            // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
            cssVariables: {
                colorSchemeSelector: 'data-mui-color-scheme',
                cssVarPrefix: 'template',
            },
            colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
            typography,
            shadows,
            shape,
            components: {
                ...inputsCustomizations,
                ...navigationCustomizations,
                ...themeComponents,
            },
            });
    }, [disableCustomTheme, themeComponents]);
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
        {children}
        </ThemeProvider>
    );
}
