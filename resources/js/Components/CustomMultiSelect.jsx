import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { useThemeContext } from '@/contexts/ThemeContext'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
  }
}

export default function CustomMultiSelect({
  id,
  label,
  placeholder,
  options = [],
  value = [],
  onChange,
  error = false,
  helperText = '',
  borderColor = 'gray',
  customSx = {},
  fullWidth = true,
  variant = 'outlined',
  menuMaxHeight = '300px',
  ...rest
}) {
  const theme = useTheme()

  // Safely check if ThemeContext is available (admin) or not (web)
  let isDark = false;
  try {
    const themeContext = useThemeContext();
    isDark = themeContext?.isDark || false;
  } catch (error) {
    // No theme context available (web pages) - default to light mode
    isDark = false;
  }

  // Get colors from Tailwind config
  const colors = {
    midnightBlue: '#1C252E !important',
    darkQuaternary: 'transparent',
    darkTertiary: '#374151',
    darkTextPrimary: '#ffffff !important',
    darkTextSecondary: '#d1d5db',
    brandPrimary: '#1c252e',
    darkBorderColor: '#333E47',
    backgroundSecondary: '#f9fafb',
    rgba: 'rgba(28, 37, 46, 0.9)'
  }

  // Define border color variants
  const borderColorVariants = {
    red: '#dc2626',
    gray: '#eaeceb',
    black: '#000000',
    blue: '#3b82f6',
    green: '#16a34a',
    custom: '#eaeceb' // fallback for custom
  }

  // Get the actual color value
  const actualBorderColor = borderColorVariants[borderColor] || borderColorVariants.gray

  // Default sx styles
  const defaultSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
      color: isDark ? colors.darkTextPrimary : 'inherit',
      '& fieldset': {
        borderColor: error ? '#dc2626' : (isDark ? colors.darkBorderColor : actualBorderColor)
      },
      '&:hover fieldset': {
        borderColor: error ? '#dc2626' : (isDark ? colors.darkTextPrimary : colors.brandPrimary),
        borderWidth: '1px'
      },
      '&.Mui-focused fieldset': {
        borderColor: error ? '#dc2626' : (isDark ? colors.darkTextPrimary : colors.brandPrimary),
        borderWidth: '2px'
      }
    },
    '& .MuiFilledInput-root': {
      backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
      color: isDark ? colors.darkTextPrimary : 'inherit',
      '&:before': {
        borderBottomColor: isDark ? colors.darkBorderColor : actualBorderColor
      },
      '&:hover:before': {
        borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor
      },
      '&:after': {
        borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor
      }
    },
    '& .MuiInput-root': {
      backgroundColor: isDark ? colors.darkQuaternary : 'transparent',
      color: isDark ? colors.darkTextPrimary : 'inherit',
      '&:before': {
        borderBottomColor: isDark ? colors.darkBorderColor : actualBorderColor
      },
      '&:hover:before': {
        borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor
      },
      '&:after': {
        borderBottomColor: isDark ? colors.darkTextPrimary : actualBorderColor
      }
    },
    // Handle label color for better consistency
    '& .MuiInputLabel-root': {
      color: '#637381 !important',
      zIndex: 1,
      backgroundColor: isDark ? colors.darkQuaternary : 'white',
      padding: '0 4px',
      '&.Mui-focused': {
        color: isDark ? colors.darkTextPrimary : actualBorderColor,
        backgroundColor: isDark ? colors.darkQuaternary : 'white'
      },
      '&.MuiInputLabel-shrink': {
        color: isDark ? colors.darkTextPrimary : 'black !important',
        backgroundColor: isDark ? colors.darkQuaternary : 'white',
        transform: 'translate(14px, -9px) scale(0.75)'
      }
    },
    // Handle select text color
    '& .MuiSelect-select': {
      color: isDark ? colors.darkTextPrimary : 'inherit'
    },
    // Handle dropdown icon color
    '& .MuiSelect-icon': {
      color: isDark ? colors.darkTextPrimary : 'inherit'
    },
    // Handle chip colors
    '& .MuiChip-root': {
      backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary,
      color: isDark ? colors.darkTextPrimary : colors.brandPrimary,
      '& .MuiChip-deleteIcon': {
        color: isDark ? colors.darkTextPrimary : colors.brandPrimary
      }
    }
  }

  // Merge custom sx with default sx
  const finalSx = {
    ...defaultSx,
    ...customSx
  }

  // MenuProps for dropdown styling
  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: isDark ? colors.rgba : 'white',
        color: isDark ? colors.darkTextPrimary : 'inherit',
        '& .MuiMenuItem-root': {
          color: isDark ? colors.darkTextPrimary : 'inherit',
          '&:hover': {
            backgroundColor: isDark ? colors.darkTertiary : colors.backgroundSecondary
          }
        },
        maxHeight: menuMaxHeight
      }
    }
  }

  const handleChange = event => {
    const {
      target: { value: selectedValues }
    } = event

    // Convert to array if it's a string (autofill case)
    const values = typeof selectedValues === 'string' ? selectedValues.split(',') : selectedValues

    // Call the onChange prop if provided
    if (onChange) {
      onChange(values)
    }
  }

  return (
    <FormControl fullWidth={fullWidth} variant={variant} sx={finalSx} error={error}>
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${id}-label`}
        id={id}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput id={`${id}-input`} label={label} />}
        renderValue={selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(selectedValue => {
              // Find the option to get the display label
              const option = options.find(opt => opt.value === selectedValue)
              const displayLabel = option ? option.label : selectedValue
              return <Chip key={selectedValue} label={displayLabel} size='small' />
            })}
          </Box>
        )}
        MenuProps={menuProps}
        {...rest}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value} style={getStyles(option.value, value, theme)}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText sx={{ color: error ? '#dc2626' : 'inherit' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}
