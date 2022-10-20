import {atom} from 'recoil';
import {recoilPersist} from 'recoil-persist';

const {persistAtom} = recoilPersist();
export const VideoState = atom({
    key : 'VideoState',
    default : [],
    effects_UNSTABLE : [persistAtom],
});