import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Button title="View All Patients" onPress={() => navigation.navigate('PatientList')} color={COLORS.primary} />
            <Button title="Add New Patient" onPress={() => navigation.navigate('AddPatient')} color={COLORS.primary} />
            <Button title="View Critical Patients" onPress={() => navigation.navigate('CriticalPatients')} color={COLORS.primary} />
            <Button title="Create Provider/Staff" onPress={() => navigation.navigate('RegisterProvider')} color={COLORS.secondary} />
            <Button title="Logout" onPress={() => navigation.replace('Login')} color={COLORS.danger} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background }
});
