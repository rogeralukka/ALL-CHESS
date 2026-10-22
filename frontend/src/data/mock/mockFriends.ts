import { Friend } from '../types';

/**
 * Mock Friends data for ALL-CHESS Phase 1.
 * Clearly fictional usernames per Section 0 hard rules.
 */
export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'f-1',
    username: 'friend_01',
    rating: 930, // MOCK
    online: true,
    lastActive: 'Now',
  },
  {
    id: 'f-2',
    username: 'PawnStorm22',
    rating: 920, // MOCK
    online: false,
    lastActive: '2h ago',
  },
  {
    id: 'f-3',
    username: 'TacticsKnight',
    rating: 915, // MOCK
    online: true,
    lastActive: '5m ago',
  },
];
