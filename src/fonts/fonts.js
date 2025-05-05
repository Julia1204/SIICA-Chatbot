import {Font} from '@react-pdf/renderer';
import InterRegular from './Inter-Regular.ttf';
import InterBold from './Inter-Bold.ttf';

Font.register({
    family: 'Inter',
    fonts: [
        {src: InterRegular, fontWeight: 'normal'},
        {src: InterBold, fontWeight: 'bold'},
    ],
});