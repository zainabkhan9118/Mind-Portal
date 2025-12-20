import { User } from '../types';

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Jane Cooper',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Premium',
        type: 'Music',
    },
    {
        id: '2',
        name: 'Wade Warren',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Premium',
        type: 'Music',
    },
    {
        id: '3',
        name: 'Esther Howard',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Free',
        type: '360',
    },
    {
        id: '4',
        name: 'Jenny Wilson',
        email: 'user@gmail.com',
        joined: '45 mins ago',
        access: 'Free',
        type: 'Music',
    },
    {
        id: '5',
        name: 'Guy Hawkins',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Premium',
        type: 'Sound',
    },
    {
        id: '6',
        name: 'Jacob Jones',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Premium',
        type: 'VR',
    },
    {
        id: '7',
        name: 'Ronald Richards',
        email: 'user@gmail.com',
        joined: '1 day ago',
        access: 'Premium',
        type: 'Sound',
    },
    {
        id: '8',
        name: 'Devon Lane',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Free',
        type: 'Free', // Actually uses a Type badge 'Free' in Image 2? Wait.
        // Image 2, Row 'Devon Lane': Access: Free (Purple). Type: Free (Purple).
        // Let's assume Type can be 'Free' too or it's a specific type.
        // Wait, the column says 'Type'. Rows have Music, 360, Sound, VR... and Free?
        // Let's check image... Devon Lane -> Type 'Free'? Or maybe it's just a placeholder text.
        // I'll stick to 'Music' for simplicity or add 'Free' as type.
    },
    {
        id: '9',
        name: 'Devon Lane', // Duplicate in screenshot?
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Free',
        type: 'Sound',
    },
    {
        id: '10',
        name: 'Jacob Jones',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Free',
        type: '360',
    },
    {
        id: '11',
        name: 'Guy Hawkins',
        email: 'user@gmail.com',
        joined: '2 hrs ago',
        access: 'Premium',
        type: 'VR',
    }
];
