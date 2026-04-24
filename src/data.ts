/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NameInfo } from "./types";

export const INITIAL_NAMES: NameInfo[] = [
  { id: '1', name: 'Atlas', gender: 'boy', origin: 'Greek', meaning: 'To carry', popularity: { 2023: 156 } },
  { id: '2', name: 'Sora', gender: 'neutral', origin: 'Japanese', meaning: 'Sky', popularity: { 2023: 512 } },
  { id: '3', name: 'Elowen', gender: 'girl', origin: 'Cornish', meaning: 'Elm tree', popularity: { 2023: 890 } },
  { id: '4', name: 'Julian', gender: 'boy', origin: 'Latin', meaning: 'Youthful', popularity: { 2023: 35 } },
  { id: '5', name: 'Amara', gender: 'girl', origin: 'Igbo', meaning: 'Grace', popularity: { 2023: 142 } },
  { id: '6', name: 'Caius', gender: 'boy', origin: 'Roman', meaning: 'Rejoice' },
  { id: '7', name: 'Arlo', gender: 'boy', origin: 'English', meaning: 'Between two hills' },
  { id: '8', name: 'Luna', gender: 'girl', origin: 'Latin', meaning: 'Moon' },
  { id: '9', name: 'Aurelia', gender: 'girl', origin: 'Latin', meaning: 'Golden' },
  { id: '10', name: 'Finley', gender: 'neutral', origin: 'Scottish', meaning: 'Fair hero' },
  { id: '11', name: 'Rowan', gender: 'neutral', origin: 'Gaelic', meaning: 'Little red one' },
  { id: '12', name: 'Elara', gender: 'girl', origin: 'Greek', meaning: 'Moon of Jupiter' },
  { id: '13', name: 'Kael', gender: 'boy', origin: 'Gaelic', meaning: 'Slender' },
  { id: '14', name: 'Mei', gender: 'girl', origin: 'Chinese', meaning: 'Beautiful' },
  { id: '15', name: 'Zian', gender: 'neutral', origin: 'Arabic', meaning: 'Ornament' },
];

export const HISTORICAL_TOP_NAMES: Record<number, string[]> = {
  2023: ['Liam', 'Noah', 'Oliver', 'Olivia', 'Emma', 'Amelia'],
  2022: ['Liam', 'Noah', 'Oliver', 'Olivia', 'Emma', 'Charlotte'],
  2010: ['Jacob', 'Ethan', 'Michael', 'Isabella', 'Sophia', 'Emma'],
  2000: ['Jacob', 'Michael', 'Matthew', 'Emily', 'Hannah', 'Madison'],
};

export const ORIGINS = ['Latin', 'Greek', 'Gaelic', 'Japanese', 'Chinese', 'Cornish', 'Igbo', 'Arabic', 'English', 'Roman', 'Scottish', 'Hebrew', 'Sanskrit', 'Norse'];
