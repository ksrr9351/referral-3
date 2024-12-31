'use client';  // This ensures the component is a client-side component

import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { SxProps } from '@mui/system';
import dayjs from 'dayjs';  // Import dayjs to handle dates

export interface BudgetProps {
  sx?: SxProps;
}

export function Budget({ sx }: BudgetProps): React.JSX.Element {
  const [userRewards, setUserRewards] = useState<number | null>(null);
  const [totalReferralRewards, setTotalReferralRewards] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTodayEarnings = async () => {
      try {
        const userId = sessionStorage.getItem('auth-session');
        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        const response = await axios.get(`/api/referrals?userId=${userId}`);
        const { userRewards, referrals } = response.data;

        // Filter referrals that were created today
        const today = dayjs().startOf('day');  // Get today's date at midnight
        const todayReferrals = referrals.filter((referral: any) =>
          dayjs(referral.date).isSame(today, 'day') // Check if referral date is today
        );

        // Calculate the total referral rewards for today
        const totalTodayReferralRewards = todayReferrals.reduce((sum: number, referral: any) => sum + referral.rewards, 0);

        setUserRewards(userRewards);  // Set the user's rewards
        setTotalReferralRewards(totalTodayReferralRewards);  // Set the total referral rewards for today
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayEarnings();
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Today's Earnings
              </Typography>
              <Typography variant="h4">
                {userRewards !== null ? `$${userRewards.toFixed(2)}` : 'N/A'}
              </Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: 'var(--mui-palette-primary-main)',
                height: '56px',
                width: '56px',
                overflow: 'hidden',
              }}
            >
              <img
                src="/assets/tokenlogo.png" // Adjust this to your actual image path
                alt="Dollar Icon"
                style={{ width: '80%', height: '80%' }}
              />
            </Avatar>
          </Stack>

          {totalReferralRewards !== null && (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Total Referral Earnings Today
              </Typography>
              <Typography variant="h6" color="text.primary">
                ${totalReferralRewards.toFixed(2)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
