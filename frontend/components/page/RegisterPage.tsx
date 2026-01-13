import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../service/api";
import { navigate } from "expo-router/build/global-state/routing";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/api/register", {
        email,
        password,
      });
      console.log("Inscription réussi");
      navigate("/");
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>
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
        <View style={styles.form}>
          <Text>Confirmer le mot de passe</Text>
          <TextInput
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.inputStyle}
          />
        </View>
        <TouchableOpacity onPress={handleRegister} style={styles.btnSubmit}>
          <Text style={styles.btnText}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    gap: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  form: {
    gap: 10,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  btnSubmit: {
    backgroundColor: "#3d8de9",
    padding: 15,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
