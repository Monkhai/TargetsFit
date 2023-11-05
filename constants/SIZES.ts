import { Dimensions, useWindowDimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

console.log(SCREEN_WIDTH);

export const LIST_ITEM_HEIGHT = (Dimensions.get('window').height / 100) * 5;
export const LIST_ITEM_WIDTH = (Dimensions.get('window').width / 100) * 90;

export const BORDER_RADIUS = 10;
