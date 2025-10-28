import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function AsynchronousInput({
    borderColor = 'gray',
    options = [],
    loading = false,
    onOpen,
    onClose,
    onChange,
    onInputChange,
    value,
    getOptionLabel,
    isOptionEqualToValue,
    renderOption,
    label = "Search",
    placeholder = "Type to search...",
    disabled = false,
    noOptionsText = "No options found",
    sx = { width: 300 },
    ...props
}) {
    const [open, setOpen] = React.useState(false);
    const { isDark } = useThemeContext();
    const handleOpen = () => {
        setOpen(true);
        if (onOpen) {
            onOpen();
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const handleInputChange = (event, newInputValue, reason) => {
        if (onInputChange) {
            onInputChange(event, newInputValue, reason);
        }
    };

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

    const actualBorderColor = borderColorVariants[borderColor] || borderColorVariants.gray;

    return (
        <Autocomplete
            sx={sx}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            onInputChange={handleInputChange}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            options={options}
            loading={loading}
            value={value}
            onChange={onChange}
            disabled={disabled}
            noOptionsText={noOptionsText}
            renderOption={renderOption}
            filterOptions={(x) => x} // Disable client-side filtering since we're doing server-side search
            {...props}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                    }}
                    sx={{
                        '& .MuiInputBase-input': {
                            '&:focus-visible': {
                                outline: 'none',
                                borderColor: 'transparent',
                                boxShadow: 'none',
                            },
                        },
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
                    }}
                />
            )}
        />
    );
}
