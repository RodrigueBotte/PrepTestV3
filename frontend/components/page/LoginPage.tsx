import { use, useState } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apiClient from "@/components/service/api"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "expo-router/build/global-state/routing";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async() =>{
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/api/login_check', {
                email,
                password
            })
            const token = response.data;
            await AsyncStorage.setItem('jwt_token', token);
            console.log('Connexion réussie');
            navigate('/');
            
        } catch (error) {
            return Alert.alert('Erreur', 'Echec lors de la connexion');
        }finally{
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, }}>
            <View style={styles.container}>
                <Text style={styles.title}>Connexion</Text>
                <View style={styles.form}>
                    <Text>Email</Text>
                    <TextInput 
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.inputStyle}
                    />
                </View>
                <View style={styles.form}>
                    <Text>Mot de passe</Text>
                    <TextInput 
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.inputStyle}
                    />
                </View>
                <TouchableOpacity onPress={handleLogin} style={styles.btnSubmit}>
                    <Text style= {styles.btnText}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 25
    },
    title:{
        fontSize: 25
    },
    form:{
        gap: 10
    },
    inputStyle:{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    btnSubmit:{
        backgroundColor: '#3d8de9',
        padding: 15,
        borderRadius: 5,
    },
    btnText:{
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})