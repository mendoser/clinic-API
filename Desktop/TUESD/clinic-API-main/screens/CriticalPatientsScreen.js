import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { API_URL } from '@env'; // Import API_URL from the .env file


export default function CriticalPatientsScreen() {
    const [criticalPatients, setCriticalPatients] = useState([]);

    useEffect(() => {
        const fetchCriticalPatients = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                console.log(token)
                const response = await axios.get(
                    `${API_URL}/api/patients/critical`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCriticalPatients(response.data);
            } catch (error) {
                console.error('Error fetching critical patients:', error);
            }
        };
        fetchCriticalPatients();
    }, []);

    return (
        <FlatList
            data={criticalPatients}
            keyExtractor={(item) => item.patient._id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item.patient.name}</Text>
                    <Text style={styles.subTitle}>Age: {item.patient.age} | Gender: {item.patient.gender}</Text>
                    {item.records.map((record, index) => (
                        <Text key={index} style={styles.record}>
                            {record.type}: {record.reading}
                        </Text>
                    ))}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    title: { fontSize: 18, color: COLORS.primary },
    subTitle: { fontSize: 16, color: COLORS.text },
    record: { fontSize: 14, color: COLORS.secondary, marginTop: 5 }
});
