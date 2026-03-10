import { z } from 'zod';
import { TEAM_ROLE_VALUES } from './constants';
import { TeamRoleValue } from './constants';

export const addMemberSchema = z.object({
    name: z.string().max(100, 'Name must be under 100 characters').optional(),
    email: z.string().email('Invalid email address').max(254, 'Email must be under 254 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be under 100 characters'),
    role: z.string().refine((val): val is TeamRoleValue => TEAM_ROLE_VALUES.includes(val as TeamRoleValue), {
        message: 'Please select a valid role',
    }),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
