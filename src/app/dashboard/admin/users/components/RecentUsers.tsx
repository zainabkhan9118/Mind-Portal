import React, { useState, useMemo } from 'react';
import UsersFilter from './UsersFilter';
import UserTable from './UserTable';
import SwitchExpertModal from './SwitchExpertModal';
import { mockUsers } from './UsersData';
import { User } from '../types';

const RecentUsers: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserForSwitch, setSelectedUserForSwitch] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter ? user.type === typeFilter : true;
            // Time filter is mocked (no actual date sorting logic implemented on string '2 hrs ago')
            return matchesSearch && matchesType;
        });
    }, [searchQuery, typeFilter, timeFilter]);

    const handleSwitchExpert = (user: User) => {
        setSelectedUserForSwitch(user);
        setIsModalOpen(true);
    };

    const handleConfirmSwitch = () => {
        // Logic to switch user would go here
        console.log(`Switching user ${selectedUserForSwitch?.id} to Mind Expert`);
        setIsModalOpen(false);
        setSelectedUserForSwitch(null);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UsersFilter
                onSearch={setSearchQuery}
                onTypeChange={setTypeFilter}
                onTimeChange={setTimeFilter}
            />
            <UserTable users={filteredUsers} onSwitchExpert={handleSwitchExpert} />

            <SwitchExpertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSwitch}
                userName={selectedUserForSwitch?.name}
            />
        </div>
    );
};

export default RecentUsers;
