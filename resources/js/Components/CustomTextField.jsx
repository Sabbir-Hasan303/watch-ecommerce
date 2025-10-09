import { TextField, Autocomplete } from '@mui/material';
// import { useTheme } from '../Contexts/ThemeContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { inputLabelClasses } from '@mui/material/InputLabel';


const CustomTextField = ({
    borderColor = 'gray',
    customSx = {},
    fullWidth = true,
    variant = 'outlined',
    suggestion = false,
    suggestions = [],
    ...rest
}) => {
    const { isDark } = useThemeContext();

    // Get colors from Tailwind config
    const colors = {
        // darkQuaternary: '#1C252E',
        darkQuaternary: 'transparent',
        darkTertiary: '#374151',
        darkTextPrimary: '#ffffff !important',
        darkTextSecondary: '#d1d5db',
        lightTextPrimary: '#1c252e !important', // Add explicit light mode text color
        lightTextSecondary: '#6b7280',
        brandPrimary: '#1c252e',
        darkBorderColor: '#333E47',
        backgroundSecondary: '#f9fafb',
        rgba: 'rgba(28, 37, 46, 0.9)',
    };

    // Extract pure color values for autofill (without !important)
    const getAutofillTextColor = () => {
        if (isDark) {
            // Extract the color value from darkTextPrimary (remove !important)
            return colors.darkTextPrimary.replace(' !important', '');
        }
        return colors.lightTextPrimary.replace(' !important', '');
    };

    // Define border color variants
    const borderColorVariants = {
        red: '#dc2626',
        gray: '#eaeceb',
        black: '#000000',
        blue: '#3b82f6',
        green: '#16a34a',
        custom: '#eaeceb' // fallback for custom
    };

    // Get the actual color value
    const actualBorderColor = borderColorVariants[borderColor] || borderColorVariants.gray;

    // Default sx styles
    const defaultSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
            '& fieldset': {
                borderColor: isDark ? colors.darkBorderColor : actualBorderColor,
            },
            '&:hover fieldset': {
                borderColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
                borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
                borderColor: isDark ? colors.darkTextPrimary : colors.brandPrimary,
                borderWidth: '2px',
            },
            // Ensure autofill doesn't override the background
            '& input:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 1000px ${isDark ? colors.darkQuaternary : 'transparent'} inset !important`,
                WebkitTextFillColor: `${getAutofillTextColor()} !important`,
                borderRadius: '4px !important',
            },
        },
        '& .MuiFilledInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
            '&:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:hover:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:after': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
        },
        '& .MuiInput-root': {
            backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
            '&:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:hover:before': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
            '&:after': {
                borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor,
            },
        },
        // Handle label color for better consistency
        '& .MuiInputLabel-root': {
            color: '#637381 !important',
            zIndex: 1,
            backgroundColor: isDark ? colors.darkQuaternary : 'white',
            padding: '0 4px',
            '&.Mui-focused': {
                color: isDark ? colors.darkTextPrimary : actualBorderColor,
                backgroundColor: isDark ? colors.darkQuaternary : 'white',
            },
            '&.MuiInputLabel-shrink': {
                color: isDark ? colors.darkTextPrimary : 'black !important',
                backgroundColor: isDark ? colors.darkQuaternary : 'white',
                transform: 'translate(14px, -9px) scale(0.75)',
            },
            // Handle autofill label positioning
            '&.MuiInputLabel-filled': {
                backgroundColor: isDark ? colors.darkQuaternary : 'white',
                transform: 'translate(14px, -9px) scale(0.75)',
            },
        },
        // Handle input text color
        '& .MuiInputBase-input': {
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
            '&::placeholder': {
                color: isDark ? '#637381 !important' : colors.lightTextSecondary,
                opacity: isDark ? 0.7 : 1,
            },
            boxShadow: 'none !important',
            // Fix browser autofill styling
            '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 1000px ${isDark ? colors.darkQuaternary : 'transparent'} inset !important`,
                WebkitTextFillColor: `${getAutofillTextColor()} !important`,
                backgroundColor: `${isDark ? colors.darkQuaternary : 'transparent'} !important`,
                borderRadius: 'inherit !important',
                transition: 'background-color 5000s ease-in-out 0s !important',
            },
            '&:-webkit-autofill:hover': {
                WebkitBoxShadow: `0 0 0 1000px ${isDark ? colors.darkQuaternary : 'transparent'} inset !important`,
                WebkitTextFillColor: `${getAutofillTextColor()} !important`,
                backgroundColor: `${isDark ? colors.darkQuaternary : 'transparent'} !important`,
            },
            '&:-webkit-autofill:focus': {
                WebkitBoxShadow: `0 0 0 1000px ${isDark ? colors.darkQuaternary : 'transparent'} inset !important`,
                WebkitTextFillColor: `${getAutofillTextColor()} !important`,
                backgroundColor: `${isDark ? colors.darkQuaternary : 'transparent'} !important`,
            },
            '&:-webkit-autofill:active': {
                WebkitBoxShadow: `0 0 0 1000px ${isDark ? colors.darkQuaternary : 'transparent'} inset !important`,
                WebkitTextFillColor: `${getAutofillTextColor()} !important`,
                backgroundColor: `${isDark ? colors.darkQuaternary : 'transparent'} !important`,
            },
            // Firefox autofill
            '&:-moz-autofill': {
                backgroundColor: `${isDark ? colors.darkQuaternary : 'transparent'} !important`,
                color: `${getAutofillTextColor()} !important`,
            },
            // Microsoft Edge autofill
            '&:-ms-input-placeholder': {
                backgroundColor: `${isDark ? colors.darkQuaternary : 'transparent'} !important`,
                color: `${getAutofillTextColor()} !important`,
            },
        },
        // Handle dropdown arrow color (for autocomplete)
        '& .MuiAutocomplete-popupIndicator': {
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
        },
        // Handle clear button color (for autocomplete)
        '& .MuiAutocomplete-clearIndicator': {
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
        },
    };

    // Merge custom sx with default sx
    const finalSx = {
        ...defaultSx,
        ...customSx,
    };

    // PaperComponent props for dropdown styling (when using suggestions)
    const paperProps = {
        sx: {
            backgroundColor: isDark ? colors.rgba : 'white',
            color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
            '& .MuiAutocompleteOption': {
                color: isDark ? colors.darkTextPrimary : colors.lightTextPrimary,
                '&:hover': {
                    backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary,
                },
                '&[aria-selected="true"]': {
                    backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary,
                },
            },
        },
    };

    // Check if suggestions should be shown
    const shouldShowSuggestions = suggestion && Array.isArray(suggestions) && suggestions.length > 0;

    // If suggestions are provided and not empty, render Autocomplete
    if (shouldShowSuggestions) {
        // Extract necessary props for Autocomplete
        const { value, onChange, label, error, helperText, required, ...autocompleteRest } = rest;

        // Handle value change for autocomplete
        const handleAutocompleteChange = (event, newValue) => {
            if (onChange) {
                // Create a synthetic event object similar to regular input onChange
                const syntheticEvent = {
                    target: {
                        value: newValue || ''
                    }
                };
                onChange(syntheticEvent);
            }
        };

        return (
            <Autocomplete
                fullWidth={fullWidth}
                options={suggestions}
                value={value || ''}
                onChange={handleAutocompleteChange}
                freeSolo={true} // Allow free text input
                autoComplete
                autoHighlight
                PaperComponent={(props) => <div {...props} style={{ ...props.style, ...paperProps.sx }} />}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        variant={variant}
                        required={required}
                        error={error}
                        helperText={helperText}
                        sx={finalSx}
                    />
                )}
                {...autocompleteRest}
            />
        );
    }

    // Default behavior: render regular TextField
    return (
        <TextField
            variant={variant}
            fullWidth={fullWidth}
            sx={finalSx}
            {...rest}
        />
    );
};

export default CustomTextField;
