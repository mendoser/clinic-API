import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PatientListScreen from './screens/PatientListScreen';
import AddPatientScreen from './screens/AddPatientScreen';
import PatientDetailsScreen from './screens/PatientDetailsScreen';
import AddClinicalDataScreen from './screens/AddClinicalDataScreen';
import CriticalPatientsScreen from './screens/CriticalPatientsScreen';
import RegisterProviderScreen from './screens/RegisterProviderScreen';
import { COLORS } from './theme';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="PatientList" component={PatientListScreen} options={{ title: 'Patient List' }} />
                <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ title: 'Add Patient' }} />
                <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} options={{ title: 'Patient Details' }} />
                <Stack.Screen name="AddClinicalData" component={AddClinicalDataScreen} options={{ title: 'Add Clinical Data' }} />
                <Stack.Screen name="CriticalPatients" component={CriticalPatientsScreen} options={{ title: 'Critical Patients' }} />
                <Stack.Screen name="RegisterProvider" component={RegisterProviderScreen} options={{ title: 'Register Provider' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
