import React from 'react';
import {View} from 'react-native';

import {MaterialCommunityIcons} from '@expo/vector-icons';

function Icon({
    //  we are giving these props a default value to make things easier
    name,
    size=40,
    backgroundColor="#000",
    iconColor="#fff"
}) {
    return (
       <View style={{
           width: size,
           height: size,
           borderRadius: size/2,
           backgroundColor: backgroundColor,
           justifyContent: 'center',
           alignItems: 'center'
       }}>
           <MaterialCommunityIcons name={name} color={iconColor} size={size * 0.5}></MaterialCommunityIcons>
       </View>
    );
}

export default Icon;