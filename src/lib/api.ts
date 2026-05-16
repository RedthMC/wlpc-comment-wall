import { createClient, type REALTIME_SUBSCRIBE_STATES, type RealtimeChannel } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export interface Comment {
    id: string;
    name: string;
    comment: string;
    timestamp: Date;
}

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
let channel: RealtimeChannel | null = null;
let currentStatus: REALTIME_SUBSCRIBE_STATES | null = null;

let callback: (comments: Comment[]) => void = () => { };
let statusCallback: (status: REALTIME_SUBSCRIBE_STATES) => void = () => { };

export async function appendComment(comment: Omit<Comment, 'id' | 'timestamp'>): Promise<boolean> {
    const { error } = await supabase.from('comments').insert([comment]).select().single();
    if (error) { console.error('Failed to insert comment:', error); return false; }
    return true;
}

export async function fetchComments(): Promise<Comment[] | null> {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) { console.error('Failed to fetch comments:', error); return null; }

    return (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        comment: c.comment,
        timestamp: new Date(c.timestamp),
    }));
}

async function connect() {
    if (channel && currentStatus === "SUBSCRIBED") return;
    if (channel) await supabase.removeChannel(channel);
    channel = supabase
        .channel('comments-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, updateComments)
        .subscribe(onStatus, 20000);
    channel.rejoinTimer.timer = 10_000;
}

function onStatus(status: REALTIME_SUBSCRIBE_STATES) {
    currentStatus = status;
    statusCallback(status);
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        // setTimeout(connect, 20000);
    }
}

async function updateComments() {
    const comments = await fetchComments();
    if (comments) callback(comments);
}

export function setupRealtime(
    callbackNew: (comments: Comment[]) => void,
    statusCallbackNew: (status: REALTIME_SUBSCRIBE_STATES) => void
) {
    callback = callbackNew;
    statusCallback = statusCallbackNew;
 
    connect();
    updateComments();

    return { destroy() { if (channel) supabase.removeChannel(channel); } };
}

export function formatRelativeTime(date: Date): string {
    const diff = Date.now() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    if (seconds < 60) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    if (days < 7) return `${days} 天前`;
    return `${weeks} 週前`;
}
