import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const LIST_ITEM_HEIGHT = Math.min((Dimensions.get('window').height / 100) * 5, 48);
export const LIST_ITEM_WIDTH = (Dimensions.get('window').width / 100) * 90;

export const BORDER_RADIUS = 10;
