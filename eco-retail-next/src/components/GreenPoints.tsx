import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Park as EcoIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Add as AddIcon,
  LocalShipping as DeliveryIcon,
  Recycling as RecyclingIcon,
  Lightbulb as LightbulbIcon,
  Share as ShareIcon
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  points: number;
  level: number;
  avatar: string;
  recentActions: Action[];
  discounts?: string[]; // Added for redemption
}

interface Action {
  id: string;
  type: string;
  description: string;
  points: number;
  timestamp: Date;
  icon: React.ReactNode;
}

const actionTypes = {
  'chat_question': { points: 5, description: 'Asked eco-friendly question', icon: <LightbulbIcon /> },
  'delivery_calculation': { points: 10, description: 'Calculated delivery impact', icon: <DeliveryIcon /> },
  'diy_project': { points: 15, description: 'Shared DIY project', icon: <RecyclingIcon /> },
  'eco_tip': { points: 8, description: 'Learned eco tip', icon: <EcoIcon /> },
  'carbon_footprint': { points: 12, description: 'Calculated carbon footprint', icon: <TrendingIcon /> }
};

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'EcoWarrior',
    points: 245,
    level: 8,
    avatar: 'E',
    recentActions: [
      { id: '1', type: 'diy_project', description: 'Shared cardboard plant pots project', points: 15, timestamp: new Date('2024-01-15T10:00:00Z'), icon: <RecyclingIcon /> },
      { id: '2', type: 'eco_tip', description: 'Learned about sustainable packaging', points: 8, timestamp: new Date('2024-01-15T09:00:00Z'), icon: <EcoIcon /> }
    ]
  },
  {
    id: '2',
    name: 'GreenThumb',
    points: 189,
    level: 6,
    avatar: 'G',
    recentActions: [
      { id: '3', type: 'delivery_calculation', description: 'Calculated EV delivery impact', points: 10, timestamp: new Date('2024-01-15T08:00:00Z'), icon: <DeliveryIcon /> }
    ]
  },
  {
    id: '3',
    name: 'NatureLover',
    points: 156,
    level: 5,
    avatar: 'N',
    recentActions: [
      { id: '4', type: 'chat_question', description: 'Asked about composting tips', points: 5, timestamp: new Date('2024-01-15T07:00:00Z'), icon: <LightbulbIcon /> }
    ]
  },
  {
    id: '4',
    name: 'You',
    points: 89,
    level: 3,
    avatar: 'Y',
    recentActions: [
      { id: '5', type: 'carbon_footprint', description: 'Calculated product carbon footprint', points: 12, timestamp: new Date('2024-01-15T06:00:00Z'), icon: <TrendingIcon /> }
    ]
  }
];

const levelThresholds = [0, 25, 50, 100, 150, 200, 300, 400, 500, 750, 1000];

function getLevel(points: number): number {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (points >= levelThresholds[i]) {
      return i;
    }
  }
  return 0;
}

function getLevelTitle(level: number): string {
  const titles = [
    'Eco Beginner',
    'Green Sprout',
    'Eco Explorer',
    'Sustainability Seeker',
    'Green Guardian',
    'Eco Enthusiast',
    'Sustainability Champion',
    'Eco Master',
    'Green Legend',
    'Sustainability Hero',
    'Eco Legend'
  ];
  return titles[level] || 'Eco Legend';
}

export default function GreenPoints() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [currentUser, setCurrentUser] = useState<User>(sampleUsers[3]); // "You"
  const [openDialog, setOpenDialog] = useState(false);
  const [newAction, setNewAction] = useState({
    type: 'chat_question',
    description: ''
  });
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState('');
  const [openSocialDialog, setOpenSocialDialog] = useState(false);
  const [socialLink, setSocialLink] = useState('');
  const [socialDesc, setSocialDesc] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialMsg, setSocialMsg] = useState('');

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const userRank = sortedUsers.findIndex(user => user.id === currentUser.id) + 1;

  const addAction = () => {
    const actionType = actionTypes[newAction.type as keyof typeof actionTypes];
    const action: Action = {
      id: Date.now().toString(),
      type: newAction.type,
      description: newAction.description || actionType.description,
      points: actionType.points,
      timestamp: new Date(), // This is fine as it's only called on user interaction
      icon: actionType.icon
    };

    const updatedUser = {
      ...currentUser,
      points: currentUser.points + action.points,
      recentActions: [action, ...currentUser.recentActions.slice(0, 4)]
    };

    const newLevel = getLevel(updatedUser.points);
    if (newLevel > updatedUser.level) {
      updatedUser.level = newLevel;
    }

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(user => user.id === currentUser.id ? updatedUser : user));
    setOpenDialog(false);
    setNewAction({ type: 'chat_question', description: '' });
  };

  const progressToNextLevel = currentUser.level < levelThresholds.length - 1 
    ? ((currentUser.points - levelThresholds[currentUser.level]) / (levelThresholds[currentUser.level + 1] - levelThresholds[currentUser.level])) * 100
    : 100;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'success.main', fontWeight: 'bold', mb: 2 }}>
          Green Points System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Earn points for eco-friendly actions and compete with the community
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current User Stats */}
        <Grid xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">{currentUser.avatar}</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {currentUser.name}
                </Typography>
                <Chip
                  icon={<TrophyIcon />}
                  label={getLevelTitle(currentUser.level)}
                  color="success"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Level {currentUser.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser.points} pts
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressToNextLevel}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                {currentUser.level < levelThresholds.length - 1 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {levelThresholds[currentUser.level + 1] - currentUser.points} points to next level
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                  Rank #{userRank}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{ 
                    bgcolor: 'success.main',
                    '&:hover': { bgcolor: 'success.dark' }
                  }}
                >
                  Add Action
                </Button>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                {/* Redemption UI */}
                <Typography variant="h6" sx={{ mb: 1 }}>Redeem Points</Typography>
                <Button
                  variant="contained"
                  color="success"
                  disabled={currentUser.points < 100}
                  onClick={async () => {
                    setRedeemLoading(true);
                    setRedeemMsg('');
                    try {
                      // Replace with real userId if available
                      const res = await fetch('/api/user-rewards/redeem', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Redemption failed');
                      setRedeemMsg(data.message || 'Redeemed!');
                      setCurrentUser((u) => ({ ...u, points: data.points, discounts: data.discounts || [] }));
                    } catch (err) {
                      setRedeemMsg(err.message || 'Redemption failed');
                    }
                    setRedeemLoading(false);
                  }}
                  sx={{ mt: 1, mb: 1 }}
                >
                  {redeemLoading ? 'Redeeming...' : 'Redeem 100 Points for Discount'}
                </Button>
                {redeemMsg && <Alert severity="info" sx={{ mt: 1 }}>{redeemMsg}</Alert>}
                {currentUser.discounts && currentUser.discounts.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Your Discounts:</Typography>
                    {currentUser.discounts.map((d, i) => (
                      <Chip key={i} label={d} color="primary" sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => setOpenSocialDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Submit Social Media Proof
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Leaderboard */}
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: 'success.main' }}>
                Community Leaderboard
              </Typography>
              <List>
                {sortedUsers.map((user, index) => (
                  <ListItem key={user.id} sx={{ 
                    bgcolor: user.id === currentUser.id ? 'success.light' : 'transparent',
                    borderRadius: 1,
                    mb: 1
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: index < 3 ? ['gold', 'silver', 'bronze'][index] : 'primary.main',
                        width: 40,
                        height: 40
                      }}>
                        {index < 3 ? <StarIcon /> : <Typography>{user.avatar}</Typography>}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {user.name}
                          </Typography>
                          {index < 3 && (
                            <Chip
                              label={`#${index + 1}`}
                              size="small"
                              color={index === 0 ? 'warning' : index === 1 ? 'default' : 'error'}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <span>
                          {user.points} points • Level {user.level} • {getLevelTitle(user.level)}
                          {user.recentActions.length > 0 && (
                            <><br /><small>Recent: {user.recentActions[0].description}</small></>
                          )}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Actions */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: 'success.main' }}>
                Your Recent Actions
              </Typography>
              <List>
                {currentUser.recentActions.map((action) => (
                  <ListItem key={action.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        {action.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={action.description}
                      secondary={action.timestamp.toLocaleString()}
                    />
                    <Chip
                      label={`+${action.points} pts`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Action Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Eco-Friendly Action</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Action Type"
            value={newAction.type}
            onChange={(e) => setNewAction({ ...newAction, type: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          >
            {Object.entries(actionTypes).map(([key, action]) => (
              <MenuItem key={key} value={key}>
                {action.description} (+{action.points} pts)
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description (optional)"
            value={newAction.description}
            onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
            placeholder="Describe your eco-friendly action..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={addAction}
            variant="contained"
            sx={{ bgcolor: 'success.main' }}
          >
            Add Action
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSocialDialog} onClose={() => setOpenSocialDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Social Media Proof</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Social Media Link"
            value={socialLink}
            onChange={e => setSocialLink(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Paste your Instagram, Twitter, or Facebook post link"
          />
          <TextField
            fullWidth
            label="Description (optional)"
            value={socialDesc}
            onChange={e => setSocialDesc(e.target.value)}
            placeholder="Describe your eco-friendly activity..."
          />
          {socialMsg && <Alert severity="info" sx={{ mt: 2 }}>{socialMsg}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSocialDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              setSocialLoading(true);
              setSocialMsg('');
              try {
                const res = await fetch('/api/user-rewards', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: currentUser.id,
                    type: 'social',
                    description: socialDesc,
                    proofUrl: socialLink
                  })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || data.message || 'Submission failed');
                setSocialMsg('Submitted for review! Points will be awarded after approval.');
                setOpenSocialDialog(false);
                setSocialLink('');
                setSocialDesc('');
                // Optionally update activity list
                setCurrentUser(u => ({ ...u, recentActions: [
                  { id: Date.now().toString(), type: 'social', description: socialDesc, points: 0, timestamp: new Date(), icon: <ShareIcon /> },
                  ...u.recentActions.slice(0, 4)
                ] }));
              } catch (err) {
                setSocialMsg(err.message || 'Submission failed');
              }
              setSocialLoading(false);
            }}
            variant="contained"
            color="success"
            disabled={!socialLink || socialLoading}
          >
            {socialLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 