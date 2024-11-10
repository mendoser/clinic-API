import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Import dropdown picker
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { API_URL } from '@env'; // Import API_URL from the .env file


export default function AddClinicalDataScreen({ route, navigation }) {
    const { patientId } = route.params;
    const [type, setType] = useState(null); // Initially null
    const [reading, setReading] = useState('');
    const types = ["Blood Pressure", "Respiratory Rate", "Blood Rate", "HeartBeat Rate"]
    const [placeholder, setPlaceholder] = useState('Select Type');


    // Handle type selection change and dynamically set the placeholder for the input field
    const handleTypeChange = (selectedType) => {
        setType(selectedType);
        if (selectedType) {
            // Dynamically set placeholder based on the selected type
            switch (selectedType) {
                case 'Blood Pressure':
                    setPlaceholder('Enter Blood Pressure (X/Y mmHg)');
                    break;
                case 'Respiratory Rate':
                    setPlaceholder('Enter Respiratory Rate (X/min)');
                    break;
                case 'Blood Oxygen Level':
                    setPlaceholder('Enter Blood Oxygen Level (X%)');
                    break;
                case 'Heartbeat Rate':
                    setPlaceholder('Enter Heartbeat Rate (X/min)');
                    break;
                default:
                    setPlaceholder('Enter Reading');
            }
        }
    };

    useEffect(() => {
        handleTypeChange(type);
        },[type])

    const [open, setOpen] = useState(false);
    const handleSave = async () => {
        if (!type || !reading) {
            Alert.alert('Validation Error', 'Please select a type and enter the reading.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(
                `${API_URL}/api/patients/${patientId}/clinical-data`,
                { type, reading },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Clinical data added successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding clinical data:', error);
            Alert.alert('Error', 'Failed to add clinical data');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Clinical Data</Text>

            <Text style={styles.label}>Select Clinical Data Type</Text>
            <DropDownPicker
             multiple={false}
             value={type}
             setValue={setType}
                items={types.map(typeOption => ({
                    label: typeOption,
                    value: typeOption
                }))}
                containerStyle={styles.dropdown}
                onChangeItem={(item) => handleTypeChange(item.value)}
                open={open}
        setOpen={setOpen}
                placeholder="Select Type"
            />

            <Text style={styles.label}>Enter Reading</Text>
            <TextInput
                style={styles.input}
                value={reading}
                onChangeText={setReading}
                placeholder={placeholder}
                keyboardType="numeric"
            />

            <Button
                title="Save Clinical Data"
                onPress={handleSave}
                color={COLORS.secondary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
    label: { fontSize: 18, marginVertical: 5 },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
    dropdown: { height: 50, width: '100%', marginBottom: 20 },
});
