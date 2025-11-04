import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Paper,
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    CircularProgress,
    Alert,
    Tooltip
} from '@mui/material';
import { Send } from '@mui/icons-material';
import api from '../../services/api';

const normalizeMessages = (payload, currentUserId) => {
    if (!payload) {
        return [];
    }

    const rawMessages = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.messages)
            ? payload.messages
            : [];

    return rawMessages.map((message) => {
        const sender = message.sender && typeof message.sender === 'object'
            ? message.sender
            : { _id: message.sender };

        return {
            _id: message._id,
            content: message.content,
            type: message.type || 'text',
            senderId: sender?._id,
            senderName: sender?.name || 'Member',
            senderAvatar: sender?.image || null,
            createdAt: message.createdAt,
            isMine: sender?._id && currentUserId ? sender._id === currentUserId : false
        };
    });
};

const TeamChat = ({ teamId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef(null);

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }, [messages]);

    useEffect(() => {
        if (!teamId) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError('');

        const loadMessages = async () => {
            try {
                const res = await api.get(`/api/messages/team/${teamId}`);
                if (!isMounted) return;
                setMessages(normalizeMessages(res.data, currentUserId));
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load chat');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadMessages();

        const interval = setInterval(loadMessages, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [teamId, currentUserId]);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [sortedMessages]);

    const handleSend = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed || sending) return;
        setSending(true);
        setError('');
        try {
            const res = await api.post('/api/messages', {
                teamId,
                content: trimmed
            });
            const nextMessage = normalizeMessages([res.data], currentUserId)[0];
            setMessages((prev) => [...prev, nextMessage]);
            setInputValue('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    if (!teamId) {
        return null;
    }

    return (
        <Paper sx={{ background: 'rgba(12, 17, 31, 0.78)', border: '1px solid rgba(127, 90, 240, 0.25)', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box ref={scrollRef} sx={{ maxHeight: 320, overflowY: 'auto', pr: 1, mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={28} sx={{ color: '#7f5af0' }} />
                        </Box>
                    ) : sortedMessages.length === 0 ? (
                        <Typography sx={{ color: 'rgba(226, 232, 240, 0.6)', textAlign: 'center', py: 4 }}>
                            No messages yet. Start the conversation with your teammates!
                        </Typography>
                    ) : (
                        sortedMessages.map((message) => {
                            const align = message.isMine ? 'flex-end' : 'flex-start';
                            const bubbleColor = message.isMine ? 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)' : 'rgba(148, 163, 184, 0.12)';
                            const textColor = message.isMine ? '#fff' : '#e2e8f0';
                            return (
                                <Stack key={message._id} direction="column" alignItems={align} spacing={0.5}>
                                    <Tooltip title={`${message.senderName} · ${new Date(message.createdAt).toLocaleString()}`} placement={message.isMine ? 'left' : 'right'}>
                                        <Box sx={{ maxWidth: '70%', p: 1.5, borderRadius: 2, background: bubbleColor, color: textColor, whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 10px 20px rgba(5, 7, 20, 0.35)' }}>
                                            {!message.isMine && (
                                                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(226, 232, 240, 0.65)', fontWeight: 600, mb: 0.5 }}>
                                                    {message.senderName}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" sx={{ color: textColor }}>
                                                {message.content}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: message.isMine ? 'rgba(255,255,255,0.7)' : 'rgba(226, 232, 240, 0.5)', display: 'block', textAlign: 'right', mt: 0.5 }}>
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                </Stack>
                            );
                        })
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        placeholder="Write a message..."
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#e2e8f0',
                                '& fieldset': { borderColor: 'rgba(127, 90, 240, 0.35)' },
                                '&:hover fieldset': { borderColor: '#7f5af0' },
                                '&.Mui-focused fieldset': { borderColor: '#7f5af0' }
                            },
                            '& textarea': { lineHeight: 1.5 }
                        }}
                    />
                    <IconButton
                        onClick={handleSend}
                        disabled={sending || !inputValue.trim()}
                        sx={{
                            background: 'linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)',
                            color: '#fff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #6b47d6 0%, #25a569 100%)'
                            }
                        }}
                    >
                        {sending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <Send fontSize="small" />}
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

export default TeamChat;
