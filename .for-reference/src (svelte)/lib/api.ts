import { createClient, type REALTIME_SUBSCRIBE_STATES, type RealtimeChannel } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export interface Comment {
    id: string;
    name: string;
    comment: string;
    timestamp: Date;
}

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// for mobile
export async function appendComment(comment: Omit<Comment, "id" | "timestamp">): Promise<boolean> {
    const { data, error } = await supabase
        .from('comments')
        .insert([comment])
        .select()
        .single();

    if (error) {
        console.error('Failed to insert comment:', error);
        return false;
    }

    return true;
}

// for display
export async function fetchComments(): Promise<Comment[] | null> {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        console.error('Failed to fetch comments:', error);
        return null;
    }

    const comments = (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        comment: c.comment,
        timestamp: new Date(c.timestamp)
    }));

    return comments;
}

function testData(callback: (comments: Comment[]) => void) {
    callback([
        {
            id: "1",
            name: "甲",
            comment: "好看",
            timestamp: new Date(),
        },
        {
            id: "2",
            name: "abc",
            comment: "早安",
            timestamp: new Date(),
        },
    ]);
    setTimeout(() => callback([
        {
            id: crypto.randomUUID(),
            name: "67",
            comment: "676767",
            timestamp: new Date(),
        },
        {
            id: crypto.randomUUID(),
            name: "w",
            comment: "w",
            timestamp: new Date(),
        },
        {
            id: crypto.randomUUID(),
            name: "npc",
            comment: "喜歡",
            timestamp: new Date(),
        },
        {
            id: crypto.randomUUID(),
            name: "很長",
            comment: "長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長",
            timestamp: new Date(),
        },
    ]), 5000);
    return { destroy() { } };
}

// for display
export function setupRealtime(callback: (comments: Comment[]) => void, statusCallback: (status: REALTIME_SUBSCRIBE_STATES) => void) {
    // if (import.meta.env.DEV) return testData(callback);

    let channel: RealtimeChannel | null = null;

    function connect() {
        console.log('Realtime connecting...:');
        if (channel) supabase.removeChannel(channel);
        channel = supabase
            .channel('comments-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, updateComments)
            .subscribe(onStatus, 20000);
    }

    function onStatus(status: REALTIME_SUBSCRIBE_STATES) {
        console.log('Realtime connection status:', status);
        statusCallback(status);

        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Realtime channel error, attempting to reconnect...');
            setTimeout(connect, 20000);
        }
    }

    async function updateComments() {
        const comments = await fetchComments();
        console.log('Comments updated:', comments);
        if (comments) { callback(comments) };
    }

    updateComments();
    connect();

    function destroy() {
        if (channel) supabase.removeChannel(channel);
    }

    return { destroy };
}
