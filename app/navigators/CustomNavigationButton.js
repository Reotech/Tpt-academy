import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'

import colors from '../config/colors';

function CustomNavigationButton({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <MaterialCommunityIcons name='plus-circle' color={colors.white} size={35} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        borderRadius: 30,
        borderColor: colors.white,
        borderWidth: 5,
        bottom: 15
    }
})

export default CustomNavigationButton;