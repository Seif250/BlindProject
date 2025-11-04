import React, { useState, useEffect } from 'react';
import {
    Container,
    Button,
    Box,
    Alert,
    Avatar,
    Stack,
    Typography,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../services/api';
import {
    PageWrapper,
    PageHeader,
    PageTitle,
    PageSubtitle,
    SectionCard,
    SectionTitle,
    HelperText,
    AccentBadge,
    InfoChip
} from '../styled/StyledComponents';

const RequestRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: 18,
    border: '1px solid rgba(15, 23, 42, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.02)'
}));

const ManageRequests = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams/created');
            setTeams(response.data);
        } catch (error) {
            setError('Failed to load your teams.');
        }
    };

    const handleRequest = async (teamId, userId, status) => {
        try {
            await api.patch(`/teams/member-status/${teamId}/${userId}`, { status });
            setSuccess(`Request ${status === 'accepted' ? 'approved' : 'declined'} successfully.`);
            setTimeout(() => setSuccess(''), 5000);
            fetchTeams();
        } catch (error) {
            setError('Could not update the request status.');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                <PageHeader>
                    <AccentBadge>Team Management</AccentBadge>
                    <PageTitle>Join Requests</PageTitle>
                    <PageSubtitle>
                        Keep an eye on new requests and respond instantly from one clear, glowing dashboard.
                    </PageSubtitle>
                </PageHeader>

                <Stack spacing={3}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    {teams.length === 0 && !error ? (
                        <SectionCard>
                            <SectionTitle variant="h6">No teams yet</SectionTitle>
                            <HelperText>
                                Create a team to start receiving join requests right here in a tidy list.
                            </HelperText>
                        </SectionCard>
                    ) : (
                        teams.map((team) => {
                            const pendingMembers = (team.members || []).filter((member) => member.status === 'pending');

                            return (
                                <SectionCard key={team._id}>
                                    <Stack spacing={2.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                            <Box>
                                                <SectionTitle variant="h6">{team.projectName}</SectionTitle>
                                                {team.description && (
                                                    <HelperText sx={{ maxWidth: 520 }}>
                                                        {team.description}
                                                    </HelperText>
                                                )}
                                            </Box>
                                            <InfoChip label={`Team members: ${(team.members || []).filter(m => m.status === 'accepted').length}/${team.maxMembers || '-'}`} />
                                        </Box>

                                        <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.06)' }} />

                                        <SectionTitle variant="subtitle1" sx={{ mb: 0 }}>
                                            Pending join requests
                                        </SectionTitle>

                                        {pendingMembers.length === 0 ? (
                                            <HelperText>
                                                No pending requests at the moment. We will notify you as soon as a new one arrives.
                                            </HelperText>
                                        ) : (
                                            <Stack spacing={2}>
                                                {pendingMembers.map((member) => (
                                                    <RequestRow key={member.user._id}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar src={member.user.image} alt={member.user.name} />
                                                            <Box sx={{ textAlign: 'left' }}>
                                                                <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                                                                    {member.user.name}
                                                                </Typography>
                                                                <HelperText>{member.user.email}</HelperText>
                                                                <InfoChip label={`Requested role: ${member.role}`} sx={{ mt: 1 }} />
                                                            </Box>
                                                        </Box>
                                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<CheckIcon />}
                                                                onClick={() => handleRequest(team._id, member.user._id, 'accepted')}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<CloseIcon />}
                                                                onClick={() => handleRequest(team._id, member.user._id, 'rejected')}
                                                            >
                                                                Decline
                                                            </Button>
                                                        </Stack>
                                                    </RequestRow>
                                                ))}
                                            </Stack>
                                        )}
                                    </Stack>
                                </SectionCard>
                            );
                        })
                    )}
                </Stack>
            </Container>
        </PageWrapper>
    );
};

export default ManageRequests;