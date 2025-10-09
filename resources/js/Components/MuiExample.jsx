import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  TrendingUp,
  People
} from '@mui/icons-material';

export default function MuiExample() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        MUI Components Example
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="h6">1,234</Typography>
                  <Typography variant="body2">Total Orders</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">$45,678</Typography>
                  <Typography variant="body2">Revenue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">4.8</Typography>
                  <Typography variant="body2">Rating</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">2,345</Typography>
                  <Typography variant="body2">Customers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Card Example */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
                  }}
                >
                  <ShoppingCart />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Premium Watch Collection
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    High-quality timepieces crafted with precision and elegance.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label="Premium" color="primary" size="small" />
                    <Chip label="Limited Edition" color="secondary" size="small" />
                  </Box>
                  <Typography variant="h6" color="primary.main">
                    $299.99
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
              <Button variant="outlined" size="small">
                View Details
              </Button>
              <Button variant="contained" size="small">
                Add to Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="contained" fullWidth startIcon={<ShoppingCart />}>
                New Order
              </Button>
              <Button variant="outlined" fullWidth startIcon={<People />}>
                Add Customer
              </Button>
              <Button variant="outlined" fullWidth startIcon={<TrendingUp />}>
                View Analytics
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
