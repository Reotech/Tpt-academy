import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';

function SearchButton({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress} >
            <View style={styles.container}>
                <FontAwesome color={colors.mediumGray} size={17} name='search' />
                {/* <MaterialCommunityIcons  /> */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightGray,
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

})

export default SearchButton;