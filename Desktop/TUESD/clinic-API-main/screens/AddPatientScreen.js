import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { API_URL } from '@env'; // Import API_URL from the .env file


export default function AddPatientScreen({ navigation }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    const handleAddPatient = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/patients`,
                { name, age, gender },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Patient added successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Server error');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Patient Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
            />
            <Button title="Add Patient" onPress={handleAddPatient} color={COLORS.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
