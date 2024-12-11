import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { API_URL } from '@env'; // Import API_URL from the .env file


export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        console.log(API_URL)
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            await AsyncStorage.setItem('token', response.data.token);
// After successful login in handleLogin:
             navigation.replace('Home');
        } catch (error) {
            console.log(error)
            Alert.alert('Login Failed', 'Invalid username or password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none"/>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry autoCapitalize="none"/>
            <Button title="Login" onPress={handleLogin} color={COLORS.secondary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
    label: { fontSize: 16, color: COLORS.text, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
