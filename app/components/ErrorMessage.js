import React from 'react';
import { StyleSheet } from 'react-native';

import AppText from './AppText';

function ErrorMessage({ visible, error }) {
    if(!visible || !error) 
    {
        // {console.log(`error says: ${error}`)}
        return null;
    }
    
    return (
        <>
        <AppText style={styles.error}>{error}</AppText>
        {console.log(`error says: ${error}`)}
        </>
    );
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
    }
})

export default ErrorMessage;