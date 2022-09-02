import React from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

function TextLink({ title, style, onPress, ...otherProps }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Text style={style} { ...otherProps }>{ title }</Text>
        </TouchableWithoutFeedback>
    );
}

export default TextLink;