import React from 'react';
import { ActivityIndicator } from "react-native";

function AppActivityIndicator({size, color}) {
    return (
            <ActivityIndicator size={size} color={color} />
    );
}

export default AppActivityIndicator;