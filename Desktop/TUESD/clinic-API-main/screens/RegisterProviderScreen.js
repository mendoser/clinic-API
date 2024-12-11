import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { COLORS } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env'; // Import API_URL from the .env file


export default function RegisterProviderScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token)
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                username, email, password
            },{ headers: { Authorization: `Bearer ${token}` } });
            Alert.alert('Success', response.data.msg);
        } catch (error) {
            console.log(error)
            Alert.alert('Error', error.response?.data?.error || 'Server error');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            <Button title="Register Provider" onPress={handleRegister} color={COLORS.secondary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
