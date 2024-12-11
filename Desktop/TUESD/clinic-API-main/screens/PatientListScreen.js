import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { API_URL } from '@env'; // Import API_URL from the .env file


export default function PatientListScreen({ navigation }) {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            const token = await AsyncStorage.getItem('token');
            //alert(token)
            const response = await axios.get(`${API_URL}/api/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data);
            setFilteredPatients(response.data);
        };
        fetchPatients();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        setFilteredPatients(
            patients.filter(patient =>
                patient.name.toLowerCase().includes(text.toLowerCase())
            )
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search patients..."
                value={search}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredPatients}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.patientItem}
                        onPress={() => navigation.navigate('PatientDetails', { patient: item })}
                    >
                        <Text style={item.hasCriticalData ? styles.criticalPatient : styles.patientName }>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    searchInput: { marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
    patientItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    criticalPatient: { fontSize: 14, color: 'red'},
    patientName: { fontSize: 18, color: COLORS.primary }
});
