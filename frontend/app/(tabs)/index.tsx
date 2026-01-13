import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from 'expo-router/build/global-state/routing';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity>
        <Text style={styles.title}>Bienvenue sur la page d&apos;accueil</Text>
        <Link href="/login" style={styles.btnLogin}>Connexion</Link>
        <Link href="/register" style={styles.textRegister}>Pas de compte? Inscrivez vous ici !</Link>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btnLogin:{
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
  },
  textRegister:{
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    alignSelf: 'center',
  },
  title:{
    fontSize: 35,
    fontWeight: 'bold',
  }
});
