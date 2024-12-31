'use client'; // Add this at the top to mark this as a client component

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Wallet as NewIcon } from '@phosphor-icons/react/dist/ssr/Wallet';
import { useState, useEffect } from 'react';  // Importing useState and useEffect
import axios from 'axios';  // Ensure axios is imported

export interface TotalProfitProps {
  sx?: SxProps;
}

export function TotalProfit({ sx }: TotalProfitProps): React.JSX.Element {
  const [userRewards, setUserRewards] = useState<number | null>(null);  // Declare state for userRewards
  const [loading, setLoading] = useState<boolean>(true);  // Declare loading state

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const userId = sessionStorage.getItem('auth-session');
        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        // Fetch referral data from the backend
        const response = await axios.get(`/api/referrals?userId=${userId}`);
        const { userRewards } = response.data;  // Extract userRewards from the response

        setUserRewards(userRewards);  // Set userRewards state
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchReferrals();  // Fetch referral data when the component mounts
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;  // Show loading text while data is being fetched
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Total Earns
            </Typography>
            <Typography variant="h4">{userRewards !== null ? `$${userRewards.toFixed(2)}` : 'N/A'}</Typography> {/* Show formatted userRewards */}
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
            <NewIcon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
