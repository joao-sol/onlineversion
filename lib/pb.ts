import PocketBase from 'pocketbase';

// export const POCKETBASE_URL = process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://10.0.76.92:8090';
// export const POCKETBASE_URL = process.env.EXPO_PUBLIC_POCKETBASE_URL || 'https://test-pb.thorvi.dev/';
export const POCKETBASE_URL = process.env.EXPO_PUBLIC_POCKETBASE_URL || 'https://pb.thorvi.dev/';

const pb = new PocketBase(POCKETBASE_URL);


console.log('[PocketBase] Initializing with URL:', POCKETBASE_URL);

export default pb;