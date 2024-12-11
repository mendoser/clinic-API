import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { API_URL } from '@env'; // Import API_URL from the .env file

export default function PatientDetailsScreen({ route, navigation }) {
    const { patient } = route.params;
    const [clinicalData, setClinicalData] = useState([]);

    useEffect(() => {
        const fetchClinicalData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                console.log(token)
                const response = await axios.get(`${API_URL}/api/patients/${patient._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClinicalData(response.data.clinicalData); // Assuming clinicalData is populated
            } catch (error) {
                console.error('Error fetching clinical data:', error);
            }
        };

        fetchClinicalData();
    }, [patient._id]);

    const handleDeletePatient = async () => {
        Alert.alert(
            'Delete Patient',
            'Are you sure you want to delete this patient?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            console.log(token)
                            await axios.delete(`${API_URL}/api/patients/${patient._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            Alert.alert('Success', 'Patient deleted successfully.');
                            navigation.goBack(); // Navigate back to the PatientListScreen
                        } catch (error) {
                            console.error('Error deleting patient:', error);
                            Alert.alert('Error', 'Failed to delete the patient. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const renderClinicalData = ({ item }) => (
        <View style={styles.clinicalDataItem}>
            <Text style={styles.clinicalDataText}>
                {item.type}: {item.reading}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patient Details</Text>
            <Text style={styles.label}>Name: {patient.name}</Text>
            <Text style={styles.label}>Age: {patient.age}</Text>
            <Text style={styles.label}>Gender: {patient.gender}</Text>

            <Text style={styles.subtitle}>Clinical Data:</Text>
            <FlatList
                data={clinicalData}
                keyExtractor={(item) => item._id}
                renderItem={renderClinicalData}
                ListEmptyComponent={<Text>No clinical data available.</Text>}
            />

            <Button
                title="Add Clinical Data"
                onPress={() => navigation.navigate('AddClinicalData', { patientId: patient._id })}
                color={COLORS.secondary}
            />
            <View style={styles.deleteButtonContainer}>
                <Button
                    title="Delete Patient"
                    onPress={handleDeletePatient}
                    color="red"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
    label: { fontSize: 18, marginVertical: 5 },
    subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 15 },
    clinicalDataItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    clinicalDataText: { fontSize: 16, color: COLORS.primary },
    deleteButtonContainer: { marginTop: 20 },
});
