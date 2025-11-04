import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Avatar,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Divider,
    TextField,
    IconButton
} from '@mui/material';
import { ChatBubbleOutline, Check, Close, Send } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
    getPendingConversationRequests,
    respondToConversationRequest,
    getConversations as fetchActiveConversations,
    getConversationMessages,
    sendConversationMessage
} from '../../services/api';

const getParticipantDisplay = (participant, status) => {
    if (!participant) {
        return 'User';
    }
    if (status === 'active') {
        return participant.name || participant.alias || 'User';
    }
    return participant.alias || participant.name || 'User';
};

const Conversations = () => {
    const { user } = useAuth();
    const viewerId = user?._id || user?.id || '';

    const [tabIndex, setTabIndex] = useState(0);
    const [pending, setPending] = useState({ incoming: [], outgoing: [] });
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    const [loadingPending, setLoadingPending] = useState(true);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const [globalError, setGlobalError] = useState('');
    const [messagesError, setMessagesError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [actionLoading, setActionLoading] = useState('');
    const [sending, setSending] = useState(false);
    const [composer, setComposer] = useState('');

    const messagesRef = useRef(null);

    useEffect(() => {
        loadPendingRequests();
        loadActiveConversations();
    }, []);

    useEffect(() => {
        if (!selectedConversationId) {
            return;
        }
        const updated = conversations.find((conversation) => conversation._id === selectedConversationId);
        if (updated) {
            setSelectedConversation(updated);
        }
    }, [conversations, selectedConversationId]);

    useEffect(() => {
        if (!messagesRef.current) {
            return;
        }
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages]);

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }, [messages]);

    const loadPendingRequests = async () => {
        setLoadingPending(true);
        try {
            const data = await getPendingConversationRequests();
            setPending({
                incoming: Array.isArray(data?.incoming) ? data.incoming : [],
                outgoing: Array.isArray(data?.outgoing) ? data.outgoing : []
            });
        } catch (error) {
            setGlobalError(error.response?.data?.message || 'Failed to load conversation requests');
        } finally {
            setLoadingPending(false);
        }
    };

    const loadActiveConversations = async () => {
        setLoadingConversations(true);
        try {
            const data = await fetchActiveConversations();
            setConversations(Array.isArray(data) ? data : []);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            setGlobalError(error.response?.data?.message || 'Failed to load conversations');
            return [];
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        setMessagesLoading(true);
        setMessagesError('');
        try {
            const data = await getConversationMessages(conversationId);
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            setMessages([]);
            setMessagesError(error.response?.data?.message || 'Failed to load messages');
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSelectConversation = async (conversation) => {
        if (!conversation) {
            return;
        }
        setSelectedConversationId(conversation._id);
        setSelectedConversation(conversation);
        setTabIndex(1);
        await fetchMessages(conversation._id);
    };

    const handleRespond = async (conversationId, action) => {
        setGlobalError('');
        setInfoMessage('');
        setActionLoading(`${conversationId}-${action}`);
        try {
            const response = await respondToConversationRequest(conversationId, action);
            await loadPendingRequests();
            const updatedConversations = await loadActiveConversations();
            if (action === 'accept') {
                const activated = updatedConversations.find((conversation) => conversation._id === conversationId)
                    || response?.conversation;
                if (activated) {
                    setInfoMessage('Conversation approved. You can chat now.');
                    await handleSelectConversation(activated);
                }
            } else {
                setInfoMessage('Conversation request rejected.');
                if (selectedConversationId === conversationId) {
                    setSelectedConversationId('');
                    setSelectedConversation(null);
                    setMessages([]);
                }
            }
        } catch (error) {
            setGlobalError(error.response?.data?.message || 'Failed to update conversation request');
        } finally {
            setActionLoading('');
        }
    };

    const handleSendMessage = async () => {
        const trimmed = composer.trim();
        if (!trimmed || !selectedConversationId || sending) {
            return;
        }
        setSending(true);
        try {
            const message = await sendConversationMessage(selectedConversationId, trimmed);
            setMessages((prev) => [...prev, message]);
            setComposer('');
            await loadActiveConversations();
        } catch (error) {
            setGlobalError(error.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const incomingRequests = pending.incoming;
    const outgoingRequests = pending.outgoing;

    const renderSkillChips = (skills) => {
        if (!skills || !skills.length) {
            return <Chip label="Skills hidden" size="small" sx={{ background: 'rgba(148, 163, 184, 0.14)', color: '#cbd5f5' }} />;
        }
        return skills.map((skill) => (
            <Chip
                key={`${skill.name}-${skill.level}`}
                label={`${skill.name}${skill.level ? ` · ${skill.level}` : ''}`}
                size="small"
                sx={{ background: 'rgba(127, 90, 240, 0.18)', color: '#7f5af0' }}
            />
        ));
    };

    const renderRequests = () => {
        if (loadingPending) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#7f5af0' }} />
                </Box>
            );
        }

        if (!incomingRequests.length && !outgoingRequests.length) {
            return (
                <Typography sx={{ color: 'rgba(226, 232, 240, 0.6)', textAlign: 'center', py: 4 }}>
                    No pending conversation requests.
                </Typography>
            );
        }

        return (
            <Stack spacing={3}>
                {incomingRequests.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Incoming</Typography>
                        <List sx={{ borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(12, 17, 31, 0.7)' }}>
                            {incomingRequests.map((request) => {
                                const requester = request.participants?.find((participant) => !participant.isViewer) || request.participants?.[0];
                                const displayName = getParticipantDisplay(requester, request.status);
                                return (
                                    <ListItem key={request._id} alignItems="flex-start" sx={{ borderBottom: '1px solid rgba(127, 90, 240, 0.12)' }}>
                                        <Stack spacing={1.2} sx={{ width: '100%' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' }}>{displayName.charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{displayName}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Identity revealed after you accept</Typography>
                                                </Box>
                                            </Stack>
                                            {request.requestMessage && (
                                                <Box sx={{ background: 'rgba(148, 163, 184, 0.12)', borderRadius: 2, p: 1.5 }}>
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.65)', fontWeight: 600 }}>Message</Typography>
                                                    <Typography variant="body2" sx={{ color: '#e2e8f0' }}>{request.requestMessage}</Typography>
                                                </Box>
                                            )}
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {renderSkillChips(requester?.skills)}
                                            </Stack>
                                            <Stack direction="row" spacing={1.5}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Check />}
                                                    onClick={() => handleRespond(request._id, 'accept')}
                                                    disabled={actionLoading === `${request._id}-accept`}
                                                    sx={{ background: 'linear-gradient(135deg, #2cb67d 0%, #16a34a 100%)', '&:hover': { background: 'linear-gradient(135deg, #25a569 0%, #15803d 100%)' } }}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Close />}
                                                    onClick={() => handleRespond(request._id, 'reject')}
                                                    disabled={actionLoading === `${request._id}-reject`}
                                                    sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' } }}
                                                >
                                                    Reject
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                )}
                {outgoingRequests.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1 }}>Outgoing</Typography>
                        <List sx={{ borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(12, 17, 31, 0.7)' }}>
                            {outgoingRequests.map((request) => {
                                const recipient = request.participants?.find((participant) => !participant.isViewer) || request.participants?.[0];
                                const displayName = getParticipantDisplay(recipient, request.status);
                                return (
                                    <ListItem key={request._id} sx={{ borderBottom: '1px solid rgba(127, 90, 240, 0.12)' }}>
                                        <Stack spacing={1} sx={{ width: '100%' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ background: 'linear-gradient(135deg, #2cb67d 0%, #0ea5e9 100%)' }}>{displayName.charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{displayName}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>Waiting for approval</Typography>
                                                </Box>
                                            </Stack>
                                            {request.requestMessage && (
                                                <Box sx={{ background: 'rgba(148, 163, 184, 0.12)', borderRadius: 2, p: 1.5 }}>
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.65)', fontWeight: 600 }}>Message</Typography>
                                                    <Typography variant="body2" sx={{ color: '#e2e8f0' }}>{request.requestMessage}</Typography>
                                                </Box>
                                            )}
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {renderSkillChips(recipient?.skills)}
                                            </Stack>
                                        </Stack>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                )}
            </Stack>
        );
    };

    const renderConversationList = () => {
        if (loadingConversations) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#7f5af0' }} />
                </Box>
            );
        }

        if (!conversations.length) {
            return (
                <Typography sx={{ color: 'rgba(226, 232, 240, 0.6)', textAlign: 'center', py: 4 }}>
                    No active conversations yet.
                </Typography>
            );
        }

        return (
            <List sx={{ borderRadius: 2, border: '1px solid rgba(127, 90, 240, 0.2)', background: 'rgba(12, 17, 31, 0.7)' }}>
                {conversations.map((conversation) => {
                    const counterpart = conversation.participants?.find((participant) => !participant.isViewer) || conversation.participants?.find((participant) => participant._id !== viewerId) || conversation.participants?.[0];
                    const displayName = getParticipantDisplay(counterpart, conversation.status);
                    const isSelected = selectedConversationId === conversation._id;
                    return (
                        <ListItemButton
                            key={conversation._id}
                            selected={isSelected}
                            onClick={() => handleSelectConversation(conversation)}
                            sx={{
                                borderBottom: '1px solid rgba(127, 90, 240, 0.12)',
                                '&.Mui-selected': {
                                    background: 'rgba(127, 90, 240, 0.18)'
                                }
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                <Avatar sx={{ background: isSelected ? 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' : 'rgba(127, 90, 240, 0.3)' }}>
                                    {displayName.charAt(0)}
                                </Avatar>
                                <ListItemText
                                    primary={displayName}
                                    secondary={conversation.lastMessageSnippet || 'No messages yet'}
                                    primaryTypographyProps={{ sx: { color: '#e2e8f0', fontWeight: 600 } }}
                                    secondaryTypographyProps={{ sx: { color: 'rgba(226, 232, 240, 0.6)', mt: 0.5 } }}
                                />
                                {conversation.lastMessageAt && (
                                    <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                                        {new Date(conversation.lastMessageAt).toLocaleDateString()}
                                    </Typography>
                                )}
                            </Stack>
                        </ListItemButton>
                    );
                })}
            </List>
        );
    };

    const canSend = selectedConversation && selectedConversation.status === 'active';

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #050714 0%, #0a0f1e 100%)', pt: 12, pb: 8 }}>
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Conversations
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.7)', textAlign: 'center' }}>
                        Manage chat requests and messages while keeping identities protected until approved.
                    </Typography>
                    {globalError && <Alert severity="error">{globalError}</Alert>}
                    {infoMessage && <Alert severity="success">{infoMessage}</Alert>}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
                        <Card sx={{ flexBasis: { md: '35%' }, background: 'rgba(12, 17, 31, 0.85)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4 }}>
                            <Tabs
                                value={tabIndex}
                                onChange={(_, value) => setTabIndex(value)}
                                variant="fullWidth"
                                textColor="secondary"
                                indicatorColor="secondary"
                                sx={{ borderBottom: '1px solid rgba(127, 90, 240, 0.1)' }}
                            >
                                <Tab label="Requests" />
                                <Tab label="Inbox" />
                            </Tabs>
                            <CardContent sx={{ maxHeight: 520, overflowY: 'auto', p: 3 }}>
                                {tabIndex === 0 ? renderRequests() : renderConversationList()}
                            </CardContent>
                        </Card>
                        <Card sx={{ flexGrow: 1, minHeight: 520, background: 'rgba(12, 17, 31, 0.85)', border: '1px solid rgba(127, 90, 240, 0.3)', borderRadius: 4 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 0 }}>
                                {selectedConversation ? (
                                    <>
                                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(127, 90, 240, 0.15)' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' }}>
                                                    {getParticipantDisplay(selectedConversation.participants?.find((participant) => !participant.isViewer) || selectedConversation.participants?.[0], selectedConversation.status).charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                                                        {getParticipantDisplay(selectedConversation.participants?.find((participant) => !participant.isViewer) || selectedConversation.participants?.[0], selectedConversation.status)}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.6)' }}>
                                                        {selectedConversation.status === 'active' ? 'Direct messaging enabled' : 'Waiting for approval'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                        <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.12)' }} />
                                        <Box ref={messagesRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            {messagesLoading ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                                    <CircularProgress sx={{ color: '#7f5af0' }} />
                                                </Box>
                                            ) : messagesError ? (
                                                <Alert severity="error">{messagesError}</Alert>
                                            ) : sortedMessages.length === 0 ? (
                                                <Typography sx={{ color: 'rgba(226, 232, 240, 0.6)', textAlign: 'center', mt: 6 }}>
                                                    No messages yet. Start the conversation once both sides approve.
                                                </Typography>
                                            ) : (
                                                sortedMessages.map((message) => {
                                                    const align = message.isMine ? 'flex-end' : 'flex-start';
                                                    const bg = message.isMine ? 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' : 'rgba(148, 163, 184, 0.12)';
                                                    const color = message.isMine ? '#fff' : '#e2e8f0';
                                                    return (
                                                        <Stack key={message._id} direction="column" alignItems={align}>
                                                            <Box sx={{ maxWidth: '70%', borderRadius: 3, p: 1.5, background: bg, color }}>
                                                                {!message.isMine && (
                                                                    <Typography variant="caption" sx={{ display: 'block', color: 'rgba(226, 232, 240, 0.75)', fontWeight: 600, mb: 0.5 }}>
                                                                        {message.sender?.name || 'Participant'}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" sx={{ color, whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                                                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: message.isMine ? 'rgba(255,255,255,0.7)' : 'rgba(226, 232, 240, 0.55)' }}>
                                                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    );
                                                })
                                            )}
                                        </Box>
                                        <Divider sx={{ borderColor: 'rgba(127, 90, 240, 0.12)' }} />
                                        <Box sx={{ p: 3, borderTop: '1px solid rgba(127, 90, 240, 0.12)', background: 'rgba(7, 11, 24, 0.9)' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    minRows={1}
                                                    maxRows={4}
                                                    placeholder={canSend ? 'Write a message…' : 'Conversation is pending approval'}
                                                    value={composer}
                                                    onChange={(event) => setComposer(event.target.value)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter' && !event.shiftKey) {
                                                            event.preventDefault();
                                                            if (canSend) {
                                                                handleSendMessage();
                                                            }
                                                        }
                                                    }}
                                                    disabled={!canSend}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: '#e2e8f0',
                                                            '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.35)' },
                                                            '&:hover fieldset': { borderColor: '#7f5af0' },
                                                            '&.Mui-focused fieldset': { borderColor: '#7f5af0' }
                                                        }
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={handleSendMessage}
                                                    disabled={!canSend || !composer.trim() || sending}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)',
                                                        color: '#fff',
                                                        '&:hover': { background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)' }
                                                    }}
                                                >
                                                    {sending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <Send fontSize="small" />}
                                                </IconButton>
                                            </Stack>
                                        </Box>
                                    </>
                                ) : (
                                    <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' }}>
                                            <ChatBubbleOutline />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600 }}>Select a conversation</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.6)', textAlign: 'center', maxWidth: 320 }}>
                                            Choose a pending request to review or pick a conversation from your inbox to start chatting safely.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Conversations;
