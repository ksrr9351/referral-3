'use client'; // Ensure this component is treated as a client-side component

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Coin as NewIcon } from '@phosphor-icons/react/dist/ssr/Coin';
import { useState, useEffect } from 'react';
import axios from 'axios';  // Importing axios

export interface TotalProfitProps {
  sx?: SxProps;
}

export function Currentrwa({ sx }: TotalProfitProps): React.JSX.Element {
  const [userRewards, setUserRewards] = useState<number | null>(null);  // State for total earnings
  const [spentAmount, setSpentAmount] = useState<number>(0);  // State for amount spent
  const [remainingRwa, setRemainingRwa] = useState<number>(0);  // State for remaining $RWA
  const [loading, setLoading] = useState<boolean>(true);  // State for loading state

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

        setUserRewards(userRewards);  // Set total earnings
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchReferrals();  // Fetch referral data when the component mounts
  }, []);

  useEffect(() => {
    // Recalculate the remaining $RWA when either userRewards or spentAmount changes
    if (userRewards !== null) {
      setRemainingRwa(userRewards - spentAmount);
    }
  }, [userRewards, spentAmount]);

  if (loading) {
    return <Typography>Loading...</Typography>;  // Show loading text while data is being fetched
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Current $RWA
            </Typography>
            <Typography variant="h4">{remainingRwa !== null ? `$${remainingRwa.toFixed(2)}` : 'N/A'}</Typography>
            {/* Display remaining $RWA */}
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
            <NewIcon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
